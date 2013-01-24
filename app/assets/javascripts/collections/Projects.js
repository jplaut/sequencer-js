var Projects = Backbone.Collection.extend({
  model: Project,
  url: "/projects",
  initialize: function() {
    _.bindAll(this);

    this.on('add', this.setModelName);
    
    this.create();
  },
  setModelName: function(model) {
    model.set({name: "Project " + (this.size())});
  }
});