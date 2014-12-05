define(function(require, exports, module) {

  var Raphael = require('./raphael');

  if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf= function(find, i /*opt*/) {
        if (i===undefined) i= 0;
        if (i<0) i+= this.length;
        if (i<0) i= 0;
        for (var n= this.length; i<n; i++)
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
  }

  if (!('forEach' in Array.prototype)) {
    Array.prototype.forEach= function(action, that /*opt*/) {
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                action.call(that, this[i], i, this);
    };
  }

  if (!('map' in Array.prototype)) {
    Array.prototype.map= function(mapper, that /*opt*/) {
        var other= new Array(this.length);
        for (var i= 0, n= this.length; i<n; i++)
            if (i in this)
                other[i]= mapper.call(that, this[i], i, this);
        return other;
    };
  }

  function createLine(id, size, values, style) {
    var HEIGHT = size / 400 * 244;
    var paper = Raphael(id, size, HEIGHT),
        padding = style.padding,
        contentSize = size - 2 * padding,
        axisX = [],
        axisY = [],
        vers = [],
        shadePath = [],
        shades,
        border,
        points = [],
        axisInter = contentSize / (values.x.length + 1);

    this.exp = function() {
      return this;
    }

    this.then = function(cb) {
      cb && cb();
      return this;
    }

    this.end = function() {
      console.log('OKK')
      return
    }

    this.exp()
      .then(drawAxisX)
      .then(calculateAxisY)
      .then(drawShadow)
      .then(drawVerLine)
      .then(drawBorder)
      .then(drawPoints)
      .end()

    function drawAxisX() {
      //draw axis
      var axisPath = {
        path: [
            ['M', padding, HEIGHT - padding],
            ['H', size - padding]
          ],
        stroke: '#908a93',
      }

      //draw axis item
      values.x.forEach( function(e, i) {
        var ax = padding + axisInter * i + 30;
        axisX.push(ax);
        var text = paper.text(ax, HEIGHT - padding + 10, e)
             .attr({
              'fill': '#837a86'
             });
        if (values.y[i] == 0) {
          text.attr({
            'fill': '#352b3a'
          })
        }
      })

      //draw axis type
      var _content = values.type == "year" ? "年" : "月";
      paper.text(size + 10 - 2 * padding , HEIGHT - padding + 10, _content)
        .attr({
            fill: "#837a86"
        });

      paper.path()
        .attr(axisPath);
    }

    function calculateAxisY() {
      //claculate Y
      values.y.forEach(function(e) {
        var max = Math.max.apply(null, values.y);
        var value = HEIGHT - parseInt(e / max * (HEIGHT - padding - 60)) - padding;
        if (value >= HEIGHT - padding - 10) {
          value = HEIGHT - padding - 10;
        }
        axisY.push(value);
      })
    }

    function drawShadow() {

      //draw shadow
      shadePath = [
        ['M', axisX[ axisX.length-1 ], HEIGHT - padding - 2],
        ['H', axisX[0]],
        ['V', HEIGHT - padding - 10]
      ]

      var initPoints = axisX.map(function(e, i) {
        return ['L', e, HEIGHT - padding - 10];
      })

      shadePath.splice.apply(shadePath, [2, 0].concat(initPoints))


      shades = paper.path().attr({
        path: shadePath,
        fill: '#3a303e',
        stroke: '#3a303e'
      })

    }

    function drawBorder() {
      borderPath = [
        //['M', axisX[0], HEIGHT - padding - 10]
      ]

      var initBorder = [
        //['M', axisX[0], HEIGHT - padding - 10]
      ]

      axisX.forEach(function(e, i) {

        if (initBorder.length == 0 ) {

          if (values.y[i] != 0) {
            var tempStart = ['M', e, HEIGHT - padding - 10];
            var tempEnd = ['M', e, axisY[i]];
            initBorder.push(tempStart);
            borderPath.push(tempEnd);
          }
        } else {
          var tempStart = ['L', e, HEIGHT - padding - 10];
          var tempEnd = ['L', e, axisY[i]];
          initBorder.push(tempStart);
          borderPath.push(tempEnd);
        }

      })

      border = paper.path().attr({
        path: initBorder,
        stroke: 'white'
      })

      var maskPath = [
        ['M', axisX[0], HEIGHT - padding - 10]
      ]

      for (var i=0 ; i < axisX.length; i++) {

      }
      axisX.forEach(function(e, i) {
        var temp = ['L', axisX[i], axisY[i]]
        if (values.y[i] == 0) {
          maskPath.push(temp)
        } else {
          //break;
        }
      })

      var temp = shadePath;

      temp.forEach(function(e, i) {
        if (i > 1 && i < 12) {
          e[2] = axisY[i-2];
        }
      })


    }



    function drawVerLine() {
      //draw ver
      axisX.forEach(function (e, i) {
        var item = drawVer(e, axisY[i]);
        vers.push(item);
      })

      function drawVer(x, y) {
        var initPath = [
          ['M', x, HEIGHT - padding - 3],
          ['V', HEIGHT - padding - 3]
        ];
        var endPath = [
          ['M', x, HEIGHT - padding - 2],
          ['V', y]
        ];
        return paper.path(initPath)
                    .attr({
                      'stroke-dasharray': '--',
                      'stroke': '#53475a'
                      //'stroke': 'red'
                    })
                    .animate({path: endPath}, 2000);
      };
    }

    function drawPoints() {
        //draw points

      axisX.forEach( function(e, i) {

        var point =  paper.circle(e, HEIGHT - padding - 10, 8)
                           .attr({
                             stroke: '#473a4d',
                             'stroke-width': 3,
                             fill: '#3a303e'
                            });

        if (values.y[i] > 0 ) {
          point.attr({
            stroke: '#4c5645',
            fill: '#6aa745'
          })
        }
        points.push(point);
      })

      points.forEach(function(e, i) {
        var ctx = {
          circle: e,
          index: i
        }
        if (values.y[i] > 0) {
          e.hover(hoverIn, hoverOut, ctx, ctx);
        }
      });

      var popups = [];

      function hoverIn() {
        initHideTop();
        var self = this.circle;
        var i = this.index;

        var x = self.attr('cx');
        var y = self.attr('cy');
        var r = self.attr('r')

        pop()

        function pop() {
          var text;
          var rect;
          var bottom;

          text = paper.text(x, y - r - 31, values.format[i]).attr({
            fill: 'white'
          });

          var box = text.getBBox();

          rect = paper.rect(box.x - 17, box.y - 5, box.x2 - box.x + 34, box.y2 - box.y + 10, 10)
            .attr({
              'stroke-width': 0,
              'fill': '#756c79',
              'opacity': '0.5'
            });

          rect.insertBefore(text)

          var tranglePath = [
            ['M', x - 4, y - 28],
            ['L', x, y - 23],
            ['L', x + 4 , y - 28],
            ['Z']
          ]
          bottom = paper.path(tranglePath)
            .attr({
              'fill': '#756c79',
              'stroke': '#756c79',
              'opacity': '0.5'
            }).insertBefore(rect)

          popups[i] = {
            remove: function() {
              text.remove();
              rect.remove();
              bottom.remove();
            }
          }

        }



        self.attr({
          fill: '#fbd328',
          'stroke-width': 6,
          stroke: '#73602e',
          r: 12
        });
        vers[i].attr({
          stroke: '#b1931c'
        })



        //self.insertBefore(temp);
      };

      function hoverOut() {

        var self = this.circle;
        var i = this.index;
        popups[i].remove();
        self = self;
        self.attr({
          r: 8,
          stroke: '#4c5645',
          fill: '#6aa745',
          'stroke-width': 3,
        });
        vers[i].attr({
          stroke: '#53475a'
        });
      };
    }

    var _initShowTop = true;
        var _initPop;
        var _initTop;
        var _initIndex;
        function initShowTop() {
          if(!_initShowTop) {
            return 
          }
          var max = Math.max.apply(null, values.y);
          var maxIndex = values.y.indexOf(max);
          var circle = points[maxIndex];
          _initTop = circle;
          _initIndex = maxIndex;
          var ctx = {
            circle: circle,
            index: maxIndex
          }

          
          var self = circle;
                var i = maxIndex;
                var x = self.attr("cx");
                var y = self.attr("cy");
                var r = self.attr("r");
                pop();
                function pop() {
                    var text;
                    var rect;
                    var bottom;
                    text = paper.text(x, y - r - 31, values.format[i]).attr({
                        fill: "white"
                    });
                    var box = text.getBBox();
                    rect = paper.rect(box.x - 17, box.y - 5, box.x2 - box.x + 34, box.y2 - box.y + 10, 10).attr({
                        "stroke-width": 0,
                        fill: "#756c79",
                        opacity: "0.5"
                    });
                    rect.insertBefore(text);
                    var tranglePath = [ [ "M", x - 4, y - 28 ], [ "L", x, y - 23 ], [ "L", x + 4, y - 28 ], [ "Z" ] ];
                    bottom = paper.path(tranglePath).attr({
                        fill: "#756c79",
                        stroke: "#756c79",
                        opacity: "0.5"
                    }).insertBefore(rect);
                    _initPop = {
                        remove: function() {
                            text.remove();
                            rect.remove();
                            bottom.remove();
                        }
                    };
                }
                self.attr({
                    fill: "#fbd328",
                    "stroke-width": 6,
                    stroke: "#73602e",
                    r: 12
                });
                vers[i].attr({
                    stroke: "#b1931c"
                });
        }

        function initHideTop() {
          if(!_initShowTop) {
            return
          }
          

          var self = _initTop;
                
                _initPop.remove();
                
                self.attr({
                    r: 8,
                    stroke: "#4c5645",
                    fill: "#6aa745",
                    "stroke-width": 3
                });
                vers[_initIndex].attr({
                    stroke: "#53475a"
                });
          

          _initShowTop = false;

        }


    paper.draw = function(interval) {
      //animate
      points.forEach(function(e, i) {
        e.animate({
          cy: axisY[i]
        }, interval)
      })
      shades.animate({path: shadePath}, interval);
      border.animate({path: borderPath}, interval);
      setTimeout(function() {
                initShowTop();
            }, interval)
    }

    return paper

  }

  exports.createLine = createLine;
});
