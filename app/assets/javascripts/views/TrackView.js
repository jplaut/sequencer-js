var TrackView = Backbone.View.extend({
  tagName: 'div',
  className: 'track',
  initialize: function() {
    _.bindAll(this);
    
    this.trackControls = new TrackControlsView({collection: this.collection, model: this.model});
    this.pattern = new PatternView({model: this.model, instrument: this.options.instrument});
    this.effectsPanel = new EffectsPanelView({collection: this.model.effects, instrument: this.options.instrument});

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