var Instruments = Backbone.Collection.extend({
  model: Instrument,
  initialize: function() {
    this.add();
  }
});