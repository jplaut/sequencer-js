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
    var json = _(this.attributes).clone();
    json.instruments = this.instruments.toJSON();

    return json;
  },
  parse: function(res, options) {
    if (res.instruments) this.instruments.reset(res.instruments);

    return res;
  }
});