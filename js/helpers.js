Handlebars.registerHelper("each_step", function(start, end, steps, options) {
  var out = "";

  for (var i = start; i < end; i++) {
    var first = (i == start) ? ' first' : '';
    var last = (i == end-1) ? ' last' : '';
    var on = (steps[i]) ? ' on' : '';
    var x = {first: first, last: last, on: on, num: i};
    out += options.fn(x);
  }

  return out;
});

Handlebars.registerHelper("createSelect", function(options) {
  var out = "";

  _(options).each(function(value, key) {
    out += "<option value=\"" + key + "\">" + value.label + "</option>";
  });

  return out;
});

Handlebars.registerHelper("createEffectsList", function(list) {
  var out = "";
  var filters = "";
  var convolver = "";

  _(list).each(function(value, key) {
    if (key.match(/^filter_/)) {
      filters += "<option value=\"" + key + "\">" + value.label + "</option>";
    } else if (key.match(/^convolver_/)) {
      convolver += "<option value=\"" + key + "\">" + value.label + "</option>";
    } else {
      out += "<option value=\"" + key + "\">" + value.label + "</option>";
    }
  })

  out += "<optgroup label=\"Filters\">" + filters + "</optgroup>";
  out += "<optgroup label=\"Convolver Effects\">" + convolver + "</optgroup>";

  return out;
});