var App = Backbone.Model.extend({
  defaults: function() {
    return {
      tempo: 120,
      numSteps: 8,
      totalBeats: 32,
      beatsPerStep: '',
      stepTime: ''
    }
  },
  initialize: function() {
    this.audioContext = new webkitAudioContext();
    this.handleChangeNumSteps();
    this.on('change:numSteps', this.handleChangeNumSteps, this);
    this.on('change:tempo', this.handleChangeTempo, this);
  },
  templateLoader: {
    directory: 'tpl/',
    load: function(template) {
      var tpl = '';
      var self = this;

      $.ajax({
        url: self.directory + template + '.html',
        async: false,
        success: function(data) {
          tpl = Handlebars.compile(data);
        }
      });

      return tpl;
    }
  },
  bufferLoader: {
    load: function(url, callback) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        app.audioContext.decodeAudioData(request.response, callback);
      }
      
      request.send();
    }
  },
  effectsList: {
    gain: {
      label: "Gain",
      params: {
        gain: {
          label: "Gain",
          min: 0,
          max: 1,
          default: 1
        }
      }
    },
    panner: {
      label: "Panner",
      params: {
        position: {
          label: 'Position',
          min: -5,
          max: 5,
          minDisplay: 'Left',
          maxDisplay: 'Right',
          default: 0
        }
      }
    },
    compressor: {
      label: "Compressor",
      params: {
        threshold: {
          label: 'Threshold',
          min: -100,
          max: 0,
          default: -24
        },
        knee: {
          label: 'Knee',
          min: 0,
          max: 40,
          default: 30
        },
        ratio: {
          label: 'Ratio',
          min: 1,
          max: 20,
          minDisplay: "1:1",
          maxDisplay: "20:1",
          default: 12
        },
        attack: {
          label: 'Attack',
          min: 0,
          max: 1,
          default: 0.003
        },
        release: {
          label: 'Release',
          min: 0,
          max: 1,
          default: 0.250
        }
      }
    },
    filter_lowpass: {
      label: "Lowpass",
      type: 0,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        Q: {
          label: 'Resonanace',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    filter_highpass: {
      label: "Highpass",
      type: 1,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        Q: {
          label: 'Resonanace',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    filter_bandpass: {
      label: "Bandpass",
      type: 2,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        Q: {
          label: 'Q',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    filter_lowshelf: {
      label: "Lowshelf",
      type: 3,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        gain: {
          label: 'Gain',
          min: -40,
          max: 40,
          default: 0
        }
      }
    },
    filter_highshelf: {
      label: "Highshelf",
      type: 4,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350,
        },
        gain: {
          label: 'Gain',
          min: -40,
          max: 40,
          default: 0
        }
      }
    },
    filter_peaking: {
      label: "Peaking",
      type: 5,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        Q: {
          label: 'Q',
          min: 0,
          max: 1000,
          default: 1
        },
        gain: {
          label: 'Gain',
          min: -40,
          max: 40,
          default: 0
        }
      }
    },
    filter_notch: {
      label: "Notch",
      type: 6,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        Q: {
          label: 'Q',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    filter_allpass: {
      label: "Allpass",
      type: 7,
      params: {
        frequency: {
          label: 'Frequency',
          min: 10,
          max: 1000,
          default: 350
        },
        Q: {
          label: 'Q',
          min: 0,
          max: 1000,
          default: 1
        }
      }
    },
    convolver_reverb_matrix_1: {
      label: "Reverb: Matrix 1",
      sampleName: "reverb_matrix_1.wav",
      params: {
        wet_dry: {
          label: 'Wet/Dry',
          min: 0,
          max: 1,
          minDisplay: 'Dry',
          maxDisplay: 'Wet',
          default: 1
        }
      }
    },
    convolver_reverb_matrix_2: {
      label: "Reverb: Matrix 2",
      sampleName: "reverb_matrix_2.wav",
      params: {
        wet_dry: {
          label: 'Wet/Dry',
          min: 0,
          max: 1,
          minDisplay: 'Dry',
          maxDisplay: 'Wet',
          default: 1
        }
      }
    },
    convolver_reverb_matrix_3: {
      label: "Reverb: Matrix 3",
      sampleName: "reverb_matrix_3.wav",
      params: {
        wet_dry: {
          label: 'Wet/Dry',
          min: 0,
          max: 1,
          minDisplay: 'Dry',
          maxDisplay: 'Wet',
          default: 1
        }
      }
    },
    convolver_reverb_spring: {
      label: "Reverb: Spring",
      sampleName: "reverb_spring.wav",
      params: {
        wet_dry: {
          label: 'Wet/Dry',
          min: 0,
          max: 1,
          minDisplay: 'Dry',
          maxDisplay: 'Wet',
          default: 1
        }
      }
    },
    convolver_small_room_reverb: {
      label: "Reverb: Small Room",
      sampleName: "reverb_small_room.wav",
      params: {
        wet_dry: {
          label: 'Wet/Dry',
          min: 0,
          max: 1,
          minDisplay: 'Dry',
          maxDisplay: 'Wet',
          default: 1
        }
      }
    },
    convolver_filter_telephone: {
      label: "Filter: Telephone",
      sampleName: "filter_telephone.wav",
      params: {
        wet_dry: {
          label: 'Wet/Dry',
          min: 0,
          max: 1,
          minDisplay: 'Dry',
          maxDisplay: 'Wet',
          default: 1
        }
      }
    },
    convolver_filter_comb_1: {
      label: "Filter: Comb 1",
      sampleName: "filter_comb_1.wav",
      params: {
        wet_dry: {
          label: 'Wet/Dry',
          min: 0,
          max: 1,
          minDisplay: 'Dry',
          maxDisplay: 'Wet',
          default: 1
        }
      }
    },
    convolver_filter_comb_2: {
      label: "Filter: Comb 2",
      sampleName: "filter_comb_2.wav",
      params: {
        wet_dry: {
          label: 'Wet/Dry',
          min: 0,
          max: 1,
          minDisplay: 'Dry',
          maxDisplay: 'Wet',
          default: 1
        }
      }
    },
    convolver_echo_ping_pong: {
      label: "Echo: Ping Pong",
      sampleName: "echo_ping_pong.wav",
      params: {
        wet_dry: {
          label: 'Wet/Dry',
          min: 0,
          max: 1,
          minDisplay: 'Dry',
          maxDisplay: 'Wet',
          default: 1
        }
      }
    },
    convolver_echo_wild: {
      label: "Echo: Wild",
      sampleName: "echo_wild.wav",
      params: {
        wet_dry: {
          label: 'Wet/Dry',
          min: 0,
          max: 1,
          minDisplay: 'Dry',
          maxDisplay: 'Wet',
          default: 1
        }
      }
    }
  },
  handleChangeNumSteps: function() {
    this.set({
      beatsPerStep: this.get('totalBeats') / this.get('numSteps'),
      stepTime: (60 / this.get('tempo')) / (this.get('numSteps') / 4)
    });
  },
  handleChangeTempo: function() {
    this.set({
      stepTime: (60 / this.get('tempo')) / (this.get('numSteps') / 4)
    });
  }
});