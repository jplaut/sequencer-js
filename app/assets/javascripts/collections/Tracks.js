var Tracks = Backbone.Collection.extend({
  model: Track,
  initialize: function() {
    this.on('add', this.addTrack);

    this.add();
  },
  addTrack: function(track) {
    track.set({name: "Track " + this.size()});
  }
});