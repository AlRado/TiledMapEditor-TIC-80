var SIZE = 32640;
var fs = require('fs');
var mapWithoutParsing = fs.readFileSync('./world_map.json');
var mapWithParsing = JSON.parse(mapWithoutParsing);
var rawData = mapWithParsing.layers[0].data;

var data = [];
for (var i = 0; i < rawData.length; i++) {
    var ix = rawData[i] - 1;
    data[i] = ix < 0 ? 0 : ix;
}
data.length = SIZE;

var buffer = Buffer.from(data)
fs.writeFileSync('./world_map.map', buffer)
