var PatternView = Backbone.View.extend({
  tagName: 'div',
  className: 'steps',
  events: {
    'click div.step': 'enableStep'
  },
  initialize: function(options) {
    _.bindAll(this);
    this.template = globals.templateLoader.load('pattern');
    this.instrument = this.options.instrument;

    this.instrument.on('change:patternLength', this.render);
  },
  render: function() {
    var options = {
      endIndex: this.instrument.get('patternLength'),
      steps: this.model.steps
    }
    this.$el.html(this.template(options).replace(/\n|\s{2,}/g, ''));

    return this;
  },
  enableStep: function(e) {
    var stepIndex = $(e.currentTarget).attr('step');

    if (!$(e.currentTarget).hasClass('on')) {
      $(e.currentTarget).addClass('on');
      this.model.steps[stepIndex] = 1;
    } else {
      $(e.currentTarget).removeClass('on');
      this.model.steps[stepIndex] = 0;
    }
  }
});