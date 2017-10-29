const SIZE = 32640,
    MAP_NAME = 'world_map';
const fs = require('fs'),
    xml2js = require('xml2js');

(new xml2js.Parser()).parseString(fs.readFileSync('./default_data/default_map.tmx'), function (err, result) {
  let tiles = result.map.layer[0].data[0].tile;
  let dataView = new DataView(fs.readFileSync(`./${MAP_NAME}.map`).buffer);
  for (var i = 0; i < SIZE; i++) {
    tiles[i] = { '$': { gid: (dataView.getInt8(i) + 1).toString() } }
  }
  fs.writeFileSync(`./${MAP_NAME}.tmx`, (new xml2js.Builder()).buildObject(result));

  console.log(`${MAP_NAME}.map converted to ${MAP_NAME}.tmx`);
});
