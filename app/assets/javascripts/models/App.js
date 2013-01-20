var App = Backbone.Model.extend({
  defaults: function() {
    return {
      tempo: 120,
      isPlaying: false,
      isPaused: false,
      isRecording: false
    }
  },
  initialize:function() {
    _.bindAll(this);

    this.beatIndex = 0;
    this.audioOut = globals.audioContext.createGainNode();
    this.audioOut.connect(globals.audioContext.destination);
    this.rec = new Recorder(this.audioOut, {workerPath: "lib/recorderWorker.js"});
    this.setStepTime(this, 120);

    this.on('change:isRecording', this.toggleRecording);
    this.on('change:isPaused', this.togglePlaybackPause);
    this.on('change:isPlaying', this.togglePlayback);
    this.on('change:tempo', this.setStepTime);
  },
  setStepTime: function(m, tempo) {
    this.stepTime = 60 / tempo / 16;
  },
  togglePlayback: function(m, isPlaying) {
    if (isPlaying) {
      this.startTime = globals.audioContext.currentTime;
      this.noteTime = 0;
      this.toggleBeatClock();
    } else {
      clearTimeout(this.interval);
      this.beatIndex = 0;
    }
  },
  togglePlaybackPause: function(m, isPaused) {
    if (isPaused) {
      clearTimeout(this.interval);
    } else {
      this.togglePlayback(m, true);
    }
  },
  toggleBeatClock: function() {
    var elapsedTime = globals.audioContext.currentTime - this.startTime;

    if (this.noteTime < elapsedTime) {
      this.trigger('beat', this.beatIndex);
      this.beatIndex = (this.beatIndex == 63) ? 0: this.beatIndex + 1;
      this.noteTime += this.stepTime;
    }

    this.interval = setTimeout(this.toggleBeatClock, 0);
  },
  toggleRecording: function(m, isRecording) {
    if (isRecording) {
      this.rec.clear();
      this.rec.record();
      this.set({isPlaying: true});
    } else {
      this.rec.stop();
      this.set({isPlaying: false});

      var c = confirm("Export recording to WAV?");
      if (c == true) this.rec.exportWAV(Recorder.forceDownload);
    }
  }
});