var AppView = Backbone.View.extend({
  tagName: 'div',
  id: 'app',
  events: {
    'change #createInstrument': 'createInstrument',
    'click #playpause': 'togglePlayback',
    'click #stop': 'stop',
    'click #rec': 'toggleRecording',
    'change #tempo': 'changeTempo'
  },
  initialize: function() {
    _.bindAll(this);

    this.template = globals.templateLoader.load('app');
    this.collection = new Instruments;

    this.collection.on('add', this.appendInstrument);
    this.model.on('remove:instrument', this.removeInstrument);
    $(window).on('resize', this.handleWindowResize);
  },
  render: function() {
    this.$el.html(this.template().replace(/\n|\s{2,}/g, ''));

    this.collection.each(function(instrument) {
      this.appendInstrument(instrument);
    }, this);

    return this;
  },
  handleWindowResize: function() {
    this.$el.height($(document).height() - 100);
    $("#transport", this.el).css('left', $(document).width() / 2 - $("#transport", this.el).width() / 2);
    $(".instrument").css('max-height', this.$el.height());
  },
  createInstrument: function(e) {
    var instrument;

    switch ($(e.currentTarget).val()) {
      case "Sequencer":
        instrument = new Sequencer;
    }
    
    this.collection.add(instrument);
    $(e.currentTarget).val('default');
  },
  appendInstrument: function(instrument) {
    $("#instruments", this.el).append(instrument.view.render().el);
    instrument.view.$el.css('max-height', this.$el.height() - 50);
  },
  togglePlayback: function() {
    if (this.model.get('isPlaying')) {
      if (this.model.get('isPaused')) {
        this.model.set({isPaused: false});
        this.flash(false, $("#playpause img"));
      } else {
        this.model.set({isPaused: true});
        this.flash(true, $("#playpause img"));
      }
    } else {
      if (this.collection.size() > 0) {
        this.model.set({isPlaying: true});
        $("#playpause img").attr("src", "img/pause.png");
      }
    }
  },
  toggleRecording: function() {
    this.model.set({isRecording: !this.model.get('isRecording')});

    if (this.model.get('isRecording')) {
      this.flash(true, $("#rec img"));
    } else {
      this.flash(false, $("#rec img"));
    }
  },
  stop: function() {
    if (this.model.get('isPlaying')) {
      this.model.set({'isPlaying': false});
      if (this.isFlashing) clearTimeout(this.isFlashing);
      if (this.model.get('isRecording')) this.model.set({isRecording: false});
      $("#playpause img").attr("src", "img/play.png");
      $("#playpause").css("display", "inline-block");
    }
  },
  flash: function(enabled, el) {
    if (enabled) {
      if (el.css('display') == "none") {
        el.css('display', "inline-block");
      } else {
        el.css('display', "none");
      }

      this.isFlashing = setTimeout(this.flash, 500, true, el);
    } else {
      el.css('display', "inline-block");
      clearTimeout(this.isFlashing);
    }
  },
  changeTempo: function(e) {
    this.model.set({tempo: e.currentTarget.value});
  },
  removeInstrument: function(model) {
    this.collection.remove(model);
  }
});