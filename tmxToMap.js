const SIZE = 32640,
    MAP_NAME = 'world_map';
const fs = require('fs'),
    xml2js = require('xml2js');

(new xml2js.Parser()).parseString(fs.readFileSync(`./${MAP_NAME}.tmx`), function (err, result) {
    let tiles = result.map.layer[0].data[0].tile;
    let data = new Int8Array(SIZE);
    for (var i = 0; i < data.length; i++) {
        data[i] = tiles[i].$.gid - 1;
    }

    try {
        fs.writeFileSync(`./${MAP_NAME}.map`, Buffer.from(data));
    } catch (e) {
        console.error('Error with writing file. ' +
            'Make sure that you has access to it');
        process.exit(1);
    }
    console.log(`${MAP_NAME}.tmx converted to ${MAP_NAME}.map`);
});
