/*
 * TO DO
 * - add save/load option
 * - allow for expanding/contracting effects (will require additional work to customize display when contracted)
 * - cache loaded buffers so they don't need to be loaded again
 * - allow for editing of individual sample playback (edit button next to sample)
 * - flam and swing
 * - model synth after moog taurus 303
*/

$(function() {
  init();
  $("#about-link").on('click', toggleAbout);
  $("#login-link").on('click', toggleLogin);

  function init() {
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      app = new App;
      var appView = new AppView({
        model: app,
        collection: app.currentProject.instruments
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
});