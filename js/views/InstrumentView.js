var InstrumentView = Backbone.View.extend({
  tagName: 'div',
  className: 'instrument',
  events: {
    'change .patternlength': 'changePatternLength',
    'change .notetype': 'changeNoteType',
    'click .addtrack': 'createTrack',
    'scroll': 'handleScroll',
    'click .removeInstrument': 'removeInstrument'
  },
  initialize: function() {
    _.bindAll(this);
    this.$el.addClass(this.model.get('type').toLowerCase());

    this.template = globals.templateLoader.load('instrument');
    this.topTemplate = globals.templateLoader.load('instrument-top');

    this.collection.on('add', this.appendTrack);
    this.model.on('change:patternLength change:noteType', this.renderTopSection);
    this.model.on('change:beat', this.changeBeat);
    this.model.on('clear:beat', this.clearBeat);
  },
  render: function() {
    var name, sequencer;

    switch (this.model.get('type')) {
      case "Sequencer":
        name = "WA-909";
        sequencer = true;
        break;
      case "Synth":
        name = "SYNTH";
        sequencer = false;
        break;
      default:
        break;
    }

    this.$el.html(this.template({name: name, sequencer: sequencer}));

    this.renderTopSection();

    this.collection.each(function(track) {
      this.appendTrack(track);
    }, this);

    if (app.get('isPlaying')) this.model.play();

    return this;
  },
  handleScroll: function(e) {
    $(".instrumentControls", this.el).css('left', this.$el.scrollLeft() + 328);
  },
  createTrack: function() {
    this.collection.add();
  },
  appendTrack: function(track) {
    var trackView = new TrackView({
      model: track,
      collection: this.collection,
      instrument: this.model
    });

    $(".tracks", this.el).append(trackView.render().el);
  },
  changePatternLength: function(e) {
    this.model.set({patternLength: $(e.currentTarget).val()});
  },
  changeNoteType: function(e) {
    this.model.set({noteType: $(e.currentTarget).val()});
  },
  setDividerWidth: function() {
    var width = (this.stepsPerBeat * 37) + ((this.stepsPerBeat - 1) * 11);
    $(".divider", this.el).width(width);
  },
  renderTopSection: function() {
    this.stepsPerBeat = this.model.get('noteType') / 4;
    this.totalBeats = Math.ceil(this.model.get('patternLength') / this.stepsPerBeat);

    var options = {
      totalBeats: this.totalBeats
    }

    $('.top', this.el).html(this.topTemplate(options).replace(/\n|\s{2,}/g, ''));

    this.createStepIndicators();
    this.setDividerWidth();
  },
  createStepIndicators: function() {
    $(".stepIndicatorBar", this.el).empty();
    var out = "";

    for (var i = 0; i < this.model.get('patternLength'); i++) {
      var first = (i == 0) ? ' first' : '',
          last = (this.model.get('patternLength') > 1 && i == this.model.get('patternLength') - 1) ? ' last' : '';

      out += "<div class=\"step" + first + last + "\" step=\"" + i + "\"></div>";
    }
    
    $(".stepIndicatorBar", this.el).append(out);
  },
  changeBeat: function(i) {
    $(".stepIndicatorBar .step", this.el).removeClass('on');
    $(".stepIndicatorBar .step[step='" + i + "']", this.el).addClass('on');
  },
  clearBeat: function() {
    $(".stepIndicatorBar .step", this.el).removeClass('on');
  },
  removeInstrument: function() {
    this.remove();
    app.trigger('remove:instrument', this.model);
  }
});