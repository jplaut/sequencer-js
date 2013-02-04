var Effect = Backbone.Model.extend({
  defaults: function() {
    return {
      type: '',
      name: '',
      enabled: true
    }
  },
  initialize: function() {
    var details = globals.effectsList[this.get('type')];

    if (this.get('type').match(/convolver_/)) {
      this.setConvolverBuffer(details.sampleName);
    }

    this.set({name: details.label});
    this.params = details.params;

    _(this.params).each(function(param) {
      param.values = [];
      param.points = [];
    });
  },
  toJSON: function(options) {
    var json = _(this.attributes).clone();
    json.params = this.params;

    return json;
  },
  parse: function(res, options) {
    if (res.params) this.params = res.params;

    if (res.type && res.type.match(/convolver_/)) {
      this.setConvolverBuffer(globals.effectsList[res.type].sampleName);
    }

    return res;
  },
  setConvolverBuffer: function(sampleName) {
    var self = this;

    globals.bufferLoader.load('audio/impulse_response/' + sampleName, globals.audioContext, function(data) {
      self.buffer = data;
    });
  },
  addEffect: function(source, i) {
    if (!this.get('enabled')) return source;

    var effectObj; 

    if (this.get('type') == 'panner') {
      var effectObj = globals.audioContext.createPanner();
      effectObj.setPosition(this.params.position.values[i], 0, -0.5);
    } else if (this.get('type').match(/convolver_/)) {
      var dry_source = globals.audioContext.createGainNode(),
          wet_source = globals.audioContext.createGainNode(),
          effectObj = globals.audioContext.createGainNode(),
          convolver = globals.audioContext.createConvolver();

      convolver.buffer = this.buffer;
      dry_source.gain.value = 1 - this.params.wet_dry.values[i];
      wet_source.gain.value = this.params.wet_dry.values[i];
      
      source.connect(convolver);
      convolver.connect(wet_source);
      source.connect(dry_source);
      dry_source.connect(effectObj);
      wet_source.connect(effectObj);
    } else {
      switch(this.get('type')) {
        case 'compressor':
          effectObj = globals.audioContext.createDynamicsCompressor();
          break;
        case 'gain':
          effectObj = globals.audioContext.createGainNode();
          break;
        default:
          effectObj = globals.audioContext.createBiquadFilter();
          effectObj.type = globals.effectsList[this.get('type')].type;
          break;
      }
      _(this.params).each(function(val, key) {
        if (val.values[i]) effectObj[key].value = val.values[i];
      });
    }

    source.connect(effectObj);
    return effectObj;
  }
});