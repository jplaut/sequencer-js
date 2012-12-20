var EffectView = Backbone.View.extend({
  tagName: 'li',
  className: 'effect',
  events: {
    'change select.paramsList': 'changeParam'
  },
  initialize: function() {
    _.bindAll(this, 'render', 'changeParam');

    this.height = 120;
    this.params = {};
    this.template = app.templateLoader.load('effect');
  },
  render: function() {
    var self = this;

    this.$el.append(self.template({name: this.model.get('name'), args: this.model.params}));

    _(this.model.params).each(function(value, key) {
      self.params[key] = new AutomationView({model: self.model, param: key});
      self.$el.append(self.params[key].render().el);
    });

    this.paramVisible = _(this.params).keys()[0];
    this.params[this.paramVisible].show();

    this.$el.height(this.height);

    return this;
  },
  changeParam: function(e) {
    this.params[this.paramVisible].hide();
    this.paramVisible = $(e.currentTarget).val();
    this.params[this.paramVisible].show();
  }
});