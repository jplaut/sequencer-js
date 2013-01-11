var Tracks = Backbone.Collection.extend({
  initialize: function(models, type) {
    switch (type) {
      case "Sequencer":
        this.model = SequencerTrack;
        break;
      case "Synth":
        this.model = SynthTrack;
        break;
      default:
        break;
    }

    this.add();
  }
});