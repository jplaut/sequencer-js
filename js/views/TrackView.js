var TrackView = Backbone.View.extend({
  tagName: 'div',
  className: 'track',
  initialize: function() {
    _.bindAll(this);

    this.instrument = this.options.instrument;
    this.type = this.instrument.get('type');

    switch (this.type) {
      case "Sequencer":
        this.pattern = new SequencerPatternView({model: this.model, instrument: this.instrument});
        break;
      case "Synth":
        this.pattern = new SynthPatternView({model: this.model, instrument: this.instrument});
        break;
      default:
        break;
    }

    this.trackControls = new TrackControlsView({collection: this.collection, model: this.model, type: this.type});
    this.effectsPanel = new EffectsPanelView({collection: this.model.effects, instrument: this.instrument});

    this.trackControls.on('toggle:effectsPanel', this.effectsPanel.toggle, this.effectsPanel);
    this.model.on('remove', this.remove, this);
  },
  render: function() {
    this.$el.html(this.trackControls.render().el);
    this.$el.append(this.pattern.render().el);
    this.$el.append("<br />");
    this.$el.append(this.effectsPanel.render().el);

    return this;
  }
});