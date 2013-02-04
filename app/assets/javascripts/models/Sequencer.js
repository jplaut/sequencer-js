var Sequencer = Backbone.Model.extend({
  defaults: function() {
    return {
      type: "Sequencer",
      patternLength: 16,
      noteType: 16
    }
  },
  initialize: function() {
    _.bindAll(this);

    this.tracks = new Tracks;

    if (typeof app != "undefined") {
      this.relativeBeatIndex = Math.ceil(app.beatIndex / (64 / this.get('noteType')));
      if (app.get('isPlaying')) this.model.play();
    } else {
      this.relativeBeatIndex = 0;
    }

    this.on('change:patternLength', this.handleChangePatternLength);
    evts.on('change:isPlaying', this.togglePlayback);
    evts.on('beat', this.play);
  },
  handleChangePatternLength: function(model, patternLength) {
    if (this.relativeBeatIndex >= patternLength) {
      this.relativeBeatIndex = 0;
    }
  },
  togglePlayback: function(isPlaying) {
    if (!isPlaying) {
      this.trigger('clear:beat');
      this.relativeBeatIndex = 0;
    }
  },
  play: function(beatIndex) {
    if (beatIndex % (64 / this.get('noteType')) == 0) {
      this.trigger('change:beat', this.relativeBeatIndex);

      if (this.tracks.any(function(track) {return track.get('solo')})) {
        this.tracks.where({solo: true})[0].playBeat(this.relativeBeatIndex);
      } else {
        this.tracks.each(function(track) {
          track.playBeat(this.relativeBeatIndex);
        }, this);
      }

      this.relativeBeatIndex = (this.relativeBeatIndex == this.get('patternLength') - 1) ? 0 : this.relativeBeatIndex + 1;
    }
  },
  toJSON: function(options) {
    var json = _(this.attributes).clone();
    json.tracks = this.tracks.toJSON();

    return json;
  },
  parse: function(res, options) {
    if (res.tracks) this.tracks.reset(res.tracks);

    return res;
  }
});