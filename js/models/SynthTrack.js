var SynthTrack = Backbone.Model.extend({
  initialize: function() {
    _.bindAll(this);

    this.effects = new Effects;
    this.notesplaying = [];

    app.on('change:isPlaying', this.stopPlayback);
  },
  stopPlayback: function(app, isPlaying) {
    if (!isPlaying) {
      _(this.notesplaying).each(function(note) {
        note.noteOff();
      });
    }
  }
})