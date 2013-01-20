var AutomationView = Backbone.View.extend({
  tagName: 'div',
  className: 'automationContainer',
  events: {
    'click .canvas': 'handleClick'
  },
  initialize: function() {
    _.bindAll(this);
    this.param = this.model.params[this.options.param];
    this.points = this.param.points;
    this.width = this.options.width - 8;
    this.height = 120;
    this.stepWidth = this.width / 16;
    this.instrument = this.options.instrument;
    this.multiplier = this.height / (this.param.max - this.param.min);
    this.automationPathStr = "";
    this.template = globals.templateLoader.load('automation');
    
    this.instrument.on('change:patternLength', this.changePatternLength);
    this.model.on('remove', this.removeCanvas);
  },
  render: function() {
    this.$el.html(this.template({options: this.param}).replace(/\n|\s{2,}/g, ''));
    this.canvas = Raphael($('.canvas', this.el)[0], this.width, this.height);

    if (this.points.length == 0) {
      this.automationPath = this.canvas.path("M0, " + (this.multiplier * (this.param.max - this.param.defaultValue)) + "H" + this.width);
    } else {
      this.points = _(this.points).filter(function(point) {return point.attr('cx') <= this.width}, this);

      for (var i = 0; i < this.points.length; i++) {
        var self = this,
            point = this.points.shift(),
            newPoint = this.canvas.circle(point.attr('cx'), point.attr('cy'), 5)
              .attr('fill', '#000')
              .drag(function(dx, dy, x, y) {
                self.handleDrag(this, dx, dy, x, y);
                }, 
                null,
                this.setValues
              );

        this.points.push(newPoint);
      }

      this.drawPathFromPoints();
    }

    return this;
  },
  toggleDisplay: function() {
    var display = (this.$el.css('display') == 'inline-block') ? 'none' : 'inline-block';

    this.$el.css('display', display);
  },
  removeCanvas: function() {
    this.instrument.off('change:patternLength', this.changePatternLength);
    this.remove();
  },
  changePatternLength: function(model, value) {
    this.width = $('.steps', this.$el.parents('.track')).width() - 8;

    if (value > this.param.values.length) {
      var str = "M" + (this.stepWidth * (value - 1)) + ", 0V" + this.height;
      var intersection = Raphael.pathIntersection(this.automationPathStr, str)[0];

      if (intersection) {
        this.param.values.push(this.param.max - (intersection.y / this.multiplier));
      } else {
        this.param.values.push(this.param.values[-1]);
      }

      this.render();
    } else {
      this.param.values.pop();
      this.render();
    }
  },
  handleClick: function (e) {
    var self = this,
        x = this.normalizeX(e.pageX),
        y = this.normalizeY(e.pageY);
        point = this.canvas.circle(x, y, 5)
          .attr('fill', '#000')
          .drag(function(dx, dy, x, y) {
              self.handleDrag(this, dx, dy, x, y);
            }, 
            null,
            this.setValues
          );
      
    if (_(this.points).any(function(point) {return x < point.attr('cx')})) {
      var i = _(this.points).indexOf(_(this.points).find(function(point) {return point.attr('cx') > x}));
      this.points.splice(i, 0, point);
    } else {
      this.points.push(point);
    }

    this.drawPathFromPoints(true);
  },
  drawPathFromPoints: function(setValues) {
    var automationPathStr;
    this.automationPath.remove();

    if (this.points.length == 1) {
      automationPathStr = "M0, " + this.points[0].attr('cy') + "H" + this.width;
    } else {
      automationPathStr = "M0, " + this.points[0].attr('cy') + "H" + this.points[0].attr('cx');

      _(this.points.slice(1, this.points.length)).each(function(point) {
        automationPathStr += "L" + point.attr('cx') + ", " + point.attr('cy');
      });

      automationPathStr += "H" + this.width;
    }
    this.automationPathStr = automationPathStr;
    this.automationPath = this.canvas.path(this.automationPathStr);

    if (setValues) {
      this.setValues();
    }
  },
  handleDrag: function(point, dx, dy, x, y) {
    var bbox = {
      x: 0,
      x2: this.width,
      y: 0,
      y2: this.height
    };

    x = this.normalizeX(x);
    y = this.normalizeY(y);

    if (Raphael.isPointInsideBBox(bbox, x, y)) {
      var i = _(this.points).indexOf(point);

      if (!(this.points[i-1] && x <= this.points[i-1].attr('cx')) && !(this.points[i+1] && x >= this.points[i+1].attr('cx')) && x > 0 && x < this.width) {
        this.points[i].attr({cx: x, cy: y});
        this.drawPathFromPoints();
      }
    }
  },
  setValues: function() {
    var values = this.getPathPoints();
    this.param.values = values;
  },
  getPathPoints: function() {
    var values = [];

    for (var i = 0; i < this.instrument.get('patternLength'); i++) {
      var str = "M" + this.stepWidth * i + ", 0V" + this.height;
      var intersection = Raphael.pathIntersection(this.automationPathStr, str)[0];

      try {
        values.push(this.param.max - (intersection.y / this.multiplier));
      } catch(err) {
        values.push('undefined');
      }
    }

    _(values).each(function(value, i) {
      if (!value || value == 'undefined') {
        values[i] = (values[i-1] + values[i+1]) / 2;
      }
    });

    return values;
  },
  normalizeX: function(x) {
    return x - $(document).scrollLeft() - this.$el.offset().left - 18;
  },
  normalizeY: function(y) {
    return y - $(document).scrollTop() - this.$el.offset().top;
  }
})