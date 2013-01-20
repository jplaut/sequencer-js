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
  if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
    var appView = new AppView({
      model: app
    });

    $(document.body).append(appView.render().el);
    appView.handleWindowResize();
  }
});