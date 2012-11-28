var SequencerView = Backbone.View.extend({
  el: $('#wrapper'),
  events: {
    'click button#addtrack': 'createTrack',
    'click button#play': 'play',
    'click button#stop': 'stop',
    'change input#tempo': 'changeTempo',
    'change select#steps': 'changeNumSteps'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'createTrack','appendTrack', 'play', 'stop', 'changeTempo', 'changeNumSteps');
    this.trackCount = 0;
    this.tempo = 120;
    this.numSteps = 8;
    this.startTime = 0;
    this.isPlaying = false;
    this.beatIndex = 0;
    this.audioContext = new webkitAudioContext();
    this.collection.bind('add', this.appendTrack);
    this.template = Handlebars.compile($("#wrapper-template").html());
    this.render();
  },
  render: function() {
    var self = this;
    $(this.el).append("<div id=\"tracks\"><ul></ul></div>");
    $(this.el).append(this.template());
    this.createTrack();

    return this;
  },
  createTrack: function() {
    this.trackCount++;
    var track = new Track();
    track.set({ numSteps: this.numSteps, trackNum: this.trackCount });
    this.collection.add(track);
  },
  appendTrack: function(track) {
    var trackView = new TrackView({
      model: track,
      audioContext: this.audioContext
    });

    $('ul', this.el).append(trackView.render().el);
    $(this.el).height($(this.el).height() + 70);
  },
  play: function() {
    var self = this;
    var currentTime = this.audioContext.currentTime;
    this.stepTime = (60 / this.tempo) / (this.numSteps / 4);

    if (!self.collection.any(function(track) {return track.get('sample')})) {
      console.log('yes');
      return;
    }

    if (self.collection.any(function(track) {return track.get('solo')})) {
      _(self.collection
        .where({solo: true})
        .filter(function(track) {return track.get('steps')[self.beatIndex] == 1 && track.get('sample')}))
        .each(function(track) {
          self.playBeat(track.get('sample'), 0);
        });
    } else {
      _(self.collection
        .filter(function(track) {return track.get('steps')[self.beatIndex] == 1 && track.get('sample')}))
        .each(function(track) {
          if (!track.get('mute')) {
            self.playBeat(track.get('sample'), 0);
          }
        });
      }

    if (this.beatIndex == this.numSteps - 1) {
      this.beatIndex = 0;
    } else {
      this.beatIndex++;
    }

   this.isPlaying = setTimeout(self.play, this.stepTime * 1000);
  },
  playBeat: function(buffer, time) {
    var source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.noteOn(time);
  },
  stop: function() {
    clearTimeout(this.isPlaying);
    this.isPlaying = false;
    this.beatIndex = 0;
  },
  changeTempo: function(e) {
    this.tempo = $(e.currentTarget).val();
  },
  changeNumSteps: function(e) {
    var self = this;

    this.numSteps = $(e.currentTarget).val();

    this.collection.each(function(track) {
      track.convertSteps(self.numSteps);
    });
  }
});