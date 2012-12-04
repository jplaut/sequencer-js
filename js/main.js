$(function() {
  var trackList = new TrackList;
  var audioContext = new webkitAudioContext();
  var sequencerView = new SequencerView({collection: trackList, audioContext: audioContext});
  $(document.body).append(sequencerView.render().el);
});