/*
 * TO DO
 * - add save/load option
 * - allow for expanding/contracting effects (will require additional work to customize display when contracted)
 * - cache loaded buffers so they don't need to be loaded again
 * - allow for editing of individual sample playback (edit button next to sample)
 * - flam and swing
 * - model synth after moog taurus 303
*/
require([
  "lib/jquery-min.js",
  "lib/json2.js",
  "lib/underscore-min.js",
  "lib/backbone-min.js",
  "lib/handlebars.js",
  "lib/raphael-min.js",
  "lib/recorder.js",
  "js/globals.js",
  "js/models/App.js",
  "../js/helpers.js", 
  "../js/models/Track.js", 
  "../js/models/Effect.js", 
  "../js/models/Sequencer.js", 
  "../js/collections/Instruments.js", 
  "../js/collections/Tracks.js", 
  "../js/collections/Effects.js", 
  "../js/views/PatternView.js", 
  "../js/views/EffectView.js", 
  "../js/views/AutomationView.js", 
  "../js/views/EffectsPanelView.js", 
  "../js/views/TrackControlsView.js", 
  "../js/views/TrackView.js", 
  "../js/views/SequencerView.js", 
  "../js/views/AppView.js"
]);

$(init);
$("#about-link").on('click', toggleAbout);
$("#login-link").on('click', toggleLogin);

function init() {
  if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    var appView = new AppView({
      model: app
    });

    $(document.body).append(appView.render().el);
    appView.handleWindowResize();
  }
}
function toggleAbout() {
  if ($("#login").css('display') == 'block') {
    $("#login").slideToggle(400);
  }

  $("#about").slideToggle(400);
  return false;
}

function toggleLogin() {
  if ($("#about").css('display') == 'block') {
    $("#about").slideToggle(400);
  }
  
  $("#login").slideToggle(400);
  return false;
}