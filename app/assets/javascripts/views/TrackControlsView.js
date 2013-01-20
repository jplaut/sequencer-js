var TrackControlsView = Backbone.View.extend({
  tagName: 'div',
  className: 'trackControls',
  events: {
    'click .solo': 'handleSolo',
    'click .mute': 'handleMute',
    'change input:file': 'setSample',
    'click .removeSample': 'removeSample',
    'click .removeTrack': 'removeTrack',
    'click .toggleEffects': 'toggleEffects',
    'dblclick .trackLabelText': 'startEditingTrackName',
    'keypress .trackLabelText': 'endEditingTrackName',
    'click .editSample': 'toggleSampleEditor'
  },
  initialize: function() {
    _.bindAll(this);

    this.template = globals.templateLoader.load('trackcontrols');
    this.isEditingTrackName = false;

    this.model.on('change:name', this.render);
    this.collection.on('remove', this.render);
    $(window).on('click', this.endEditingTrackName);
  },
  render: function() {
    var options = this.model.toJSON();
    options.name = options.name || 'Track ' + (this.collection.indexOf(this.model) + 1);
    this.$el.html(this.template(options).replace(/\n|\s{2,}/g, ''));

    return this;
  },
  handleSolo: function() {
    if (this.model.get('mute')) {
      this.flash(false, $('.mute', this.el));
      this.model.set({mute: false});
    }

    if (this.model.get('solo')) {
      this.model.set({solo: false});
      this.flash(false, $('.solo', this.el));
    } else {
      this.model.set({solo: true});
      this.flash(true, $('.solo', this.el));
    }
  },
  handleMute: function() {
    if (this.model.get('solo')) {
      this.flash(false, $('.solo', this.el));
      this.model.set({solo: false});
    }

    if (this.model.get('mute')) {
      this.model.set({mute: false});
      this.flash(false, $('.mute', this.el));
    } else {
      this.model.set({mute: true});
      this.flash(true, $('.mute', this.el));
    }
  },
  flash: function(enabled, el) {
    if (enabled) {
      if (!this.flashingColor) {
        this.flashingColor = el.css('background-color');
      }

      if (el.css('background-color') == this.flashingColor) {
        el.css('background-color', $('html').css('background-color'));
      } else {
        el.css('background-color', this.flashingColor);
      }

      this.isFlashing = setTimeout(this.flash, 500, true, el, this.flashingColor);
    } else {
      el.css('background-color', this.flashingColor);
      this.flashingColor = null;
      clearTimeout(this.isFlashing);
    }
  },
  startEditingTrackName: function() {
    if (!this.isEditingTrackName) {
      this.isEditingTrackName = true;
      $(".trackLabelText", this.el).html('<input type="text" maxlength=13 value = "' + $(".trackLabelText", this.el).text() + '" />');
      $(".trackLabelText input", this.el).select();
    }
  },
  endEditingTrackName: function(e) {
    if (this.isEditingTrackName) {
      if (
        (e.type == 'click' && e.target != $(".trackLabelText input", this.el)[0]) || 
        (e.type == 'keypress' && e.target == $(".trackLabelText input", this.el)[0] && e.keyCode == 13)
      ) {
        this.model.set({name: $(".trackLabelText input", this.el).val()});
        this.isEditingTrackName = false;
      }
    }
  },
  setSample: function(e) {
    var supportedTypes = [".wav", ".mp3", ".aac", ".ogg"];
    if (!e.currentTarget.files[0].name.match(new RegExp("\\" + supportedTypes.join("|\\") + "$"))) {
      alert("File must be one of the following formats: \n" + supportedTypes.join("\n"));
      $(e.currentTarget).html($(e.currentTarget).html());
    } else if (e.currentTarget.files.length > 0) {
      $(e.currentTarget).replaceWith("<img src=img/loading.gif />");

      this.model.setSample(
        e.currentTarget.files[0],
        function() {this.render();},
        this
      );
    }
  },
  removeSample: function() {
    this.model.set({sampleName: '', sample: null});
    this.render();
  },
  removeTrack: function() {
    if (this.collection.size() > 1) {
      this.collection.remove(this.model);
    }
  },
  toggleEffects: function() {
    if ($(".toggleEffects", this.el).hasClass('enabled')) {
      $(".toggleEffects", this.el).removeClass('enabled');
    } else {
      $(".toggleEffects", this.el).addClass('enabled');
    }

    this.trigger('toggle:effectsPanel');
  },
  toggleSampleEditor: function() {

  }
});