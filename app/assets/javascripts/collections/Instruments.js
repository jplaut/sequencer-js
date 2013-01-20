var Instruments = Backbone.Collection.extend({
  initialize: function() {
    var instrument = new Sequencer;
    this.add(instrument);
  }
});