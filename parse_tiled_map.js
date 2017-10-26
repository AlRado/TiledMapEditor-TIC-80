const fs = require('fs'),
      SIZE = 32640
let rawData = require('./world_map.json').layers[0].data;

let data = Array.from(rawData).map(e => Math.min(e - 1, 0));
data.length = SIZE;

fs.writeFileSync('./world_map.map', Buffer.from(data))
