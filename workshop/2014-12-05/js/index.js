define(function(require, exports, module) {
  var line = require('./line');
  
  var id = 'line';
  var style = { padding: 20 };
  var size= 400;


  var values = {
  "x": [
    2005,
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14"
  ],
  "y": [
    0,
    0,
    0,
    0,
    1235.18,
    225,
    34385.16,
    143678.33,
    152917.78,
    188848.47
  ],
  "format": [
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "1,235.18",
    "225.00",
    "34,385.16",
    "143,678.33",
    "152,917.78",
    "188,848.47"
  ],
  "type": "year"
}

  line.createLine(id, size, values, style)
       .draw(2000);
})
