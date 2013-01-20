var EffectView = Backbone.View.extend({
  tagName: 'div',
  className: 'effect',
  events: {
    'change .paramsList': 'changeParam',
    'click .removeEffect': 'removeEffect',
    'click .toggleEffect': 'toggleEffect'
  },
  initialize: function() {
    _.bindAll(this);

    this.expanded = true;
    this.params = {};
    this.template = globals.templateLoader.load('effect');
  },
  render: function() {
    this.$el.append(this.template({
      name: this.model.get('name'), 
      args: this.model.params
    }).replace(/\n|\s{2,}/g, ''));

    _(this.model.params).each(function(value, key) {
      this.params[key] = new AutomationView({
        model: this.model, 
        param: key,
        width: this.options.automationWidth,
        instrument: this.options.instrument
      });

      this.$el.append(this.params[key].render().el);
    }, this);

    this.paramVisible = _(this.params).keys()[0];
    this.params[this.paramVisible].toggleDisplay();

    return this;
  },
  changeParam: function(e) {
    this.params[this.paramVisible].toggleDisplay();
    this.paramVisible = $(e.currentTarget).val();
    this.params[this.paramVisible].toggleDisplay();
  },
  removeEffect: function() {
    this.collection.remove(this.model);
    this.remove();
  },
  toggleEffect: function() {
    if (this.model.get('enabled')) {
      this.model.set({enabled: false});
      $(".toggleEffect", this.el).removeClass('on');
    } else {
      this.model.set({enabled: true});
      $(".toggleEffect", this.el).addClass('on');
    }
  }
});