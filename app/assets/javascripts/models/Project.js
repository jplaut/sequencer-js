var Project = Backbone.Model.extend({
  defaults: function() {
    return {
      tempo: 120,
      name: ""
    };
  },
  initialize: function() {
    this.instruments = new Instruments;
  }
});