var globals = {
  templateLoader: {
    directory: 'tpl/views/',
    load: function(template) {
      var tpl;

      if (this.templates[template]) {
        tpl = this.templates[template];
      } else {
        var self = this;

        $.ajax({
          url: self.directory + template + '.html',
          async: false,
          success: function(data) {
            tpl = Handlebars.compile(data);
            self.templates[template] = tpl;
          }
        });
      }

      return tpl;
    },
    templates: {}
  },
  bufferLoader: {
    load: function(url, context, callback) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';

      request.onload = function() {
        context.decodeAudioData(request.response, callback);
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
          defaultValue: 1
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
          defaultValue: 0
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
          defaultValue: -24
        },
        knee: {
          label: 'Knee',
          min: 0,
          max: 40,
          defaultValue: 30
        },
        ratio: {
          label: 'Ratio',
          min: 1,
          max: 20,
          minDisplay: "1:1",
          maxDisplay: "20:1",
          defaultValue: 12
        },
        attack: {
          label: 'Attack',
          min: 0,
          max: 1,
          defaultValue: 0.003
        },
        release: {
          label: 'Release',
          min: 0,
          max: 1,
          defaultValue: 0.250
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
          defaultValue: 350
        },
        Q: {
          label: 'Resonanace',
          min: 0,
          max: 1000,
          defaultValue: 1
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
          defaultValue: 350
        },
        Q: {
          label: 'Resonanace',
          min: 0,
          max: 1000,
          defaultValue: 1
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
          defaultValue: 350
        },
        Q: {
          label: 'Q',
          min: 0,
          max: 1000,
          defaultValue: 1
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
          defaultValue: 350
        },
        gain: {
          label: 'Gain',
          min: -40,
          max: 40,
          defaultValue: 0
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
          defaultValue: 350,
        },
        gain: {
          label: 'Gain',
          min: -40,
          max: 40,
          defaultValue: 0
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
          defaultValue: 350
        },
        Q: {
          label: 'Q',
          min: 0,
          max: 1000,
          defaultValue: 1
        },
        gain: {
          label: 'Gain',
          min: -40,
          max: 40,
          defaultValue: 0
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
          defaultValue: 350
        },
        Q: {
          label: 'Q',
          min: 0,
          max: 1000,
          defaultValue: 1
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
          defaultValue: 350
        },
        Q: {
          label: 'Q',
          min: 0,
          max: 1000,
          defaultValue: 1
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
          defaultValue: 1
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
          defaultValue: 1
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
          defaultValue: 1
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
          defaultValue: 1
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
          defaultValue: 1
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
          defaultValue: 1
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
          defaultValue: 1
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
          defaultValue: 1
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
          defaultValue: 1
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
          defaultValue: 1
        }
      }
    }
  }
}

globals.audioContext = new webkitAudioContext();