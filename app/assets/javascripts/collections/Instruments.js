var Instruments = Backbone.Collection.extend({
  model: function(attrs, options) {
    switch (attrs.type) {
      case "Sequencer":
        return new Sequencer;
        break;
    }
  },
  initialize: function() {
    var instrument = new Sequencer;
    this.add(instrument);
  }
});