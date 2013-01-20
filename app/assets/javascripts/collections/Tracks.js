var Tracks = Backbone.Collection.extend({
  model: Track,
  initialize: function() {
    this.add();
  }
});