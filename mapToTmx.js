const SIZE = 32640,
    MAP_NAME = 'world_map';
var fs = require('fs'),
    xml2js = require('xml2js');

fs.readFile('./' + MAP_NAME + '.map', function (err, rawData) {
    fs.readFile('./default_data/default_map.tmx', function (err, data) {
        let parser = new xml2js.Parser();
        parser.parseString(data, function (err, result) {
            let tiles = result.map.layer[0].data[0].tile;
            let dataView = new DataView(rawData.buffer);
            for (var i = 0; i < SIZE; i++) {
                tiles[i] = { '$': { gid: (dataView.getInt8(i) + 1).toString() } }
            }
            let builder = new xml2js.Builder();
            let xml = builder.buildObject(result);
            fs.writeFileSync('./' + MAP_NAME + '.tmx', xml);

            console.log(MAP_NAME + '.map converted to ' + MAP_NAME + '.tmx');
        });
    });
});
