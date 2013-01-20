var Effects = Backbone.Collection.extend({
  model: Effect,
  addEffects: function(source, i) {
    this.each(function(effect) {
      source = effect.addEffect(source, i);
    });

    return source;
  }
})