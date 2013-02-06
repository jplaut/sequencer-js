var Project = Backbone.Model.extend({
  defaults: function() {
    return {
      tempo: 120,
      name: ""
    };
  },
  initialize: function() {
    this.instruments = new Instruments;
  },
  toJSON: function(options) {
    var json, project = _(this.attributes).clone();
    project.instruments = this.instruments.toJSON();
    json = {project: project};

    return json;
  },
  parse: function(res, options) {
    if (res.instruments) this.instruments.reset(res.instruments);

    return res;
  }
});