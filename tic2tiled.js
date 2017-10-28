const fs = require('fs'),
      xml2js = require('xml2js'),
      parser = new xml2js.Parser(),
      SIZE = 32640,
      converts = {
  'map->tmx': function(str) {
    return new Promise((res, rej) => {
      fs.readFile('default_data/default_map.tmx', 'utf-8', (err, data) => {
        if(err) {
          rej(err);
          return;
        }
        parser.parseString(data, (err, result) => {
          if(err) {
            rej(err);
            return;
          }
          let tiles = result.map.layer[0].data[0].tile;
          let dataView = new DataView(str);
          for (var i = 0; i < SIZE; i++) {
            tiles[i] = { '$': { gid: (dataView.getInt8(i) + 1).toString() } }
          }
          res((new xml2js.Builder()).buildObject(result));
        })
      })
    });
  },
  'tmx->map': function(str) {
    return new Promise((res, rej) => {
      parser.parseString(str, (err, result) => {
        if(err) rej(err);
        let tiles = result.map.layer[0].data[0].tile;
        let data = new Int8Array(SIZE);
        for (var i = 0; i < data.length; i++) {
          data[i] = tiles[i].$.gid - 1;
        }
        res(Buffer.from(data));
      })
    }
    });
};
let string, typeIn, typeOut, readed;
module.exports = {
  file: function file(filename) {
    readed = new Promise((res, rej) => {
      fs.readFile(filename, 'utf-8', (err, data) => {
        if(err) rej(err);
        else res(data);
      })
    })
    return this;
  },
  string: function string(str) {
    string = (typeof str == 'string') ? str : str.toString();
    return this;
  },
  from: function from(type) {
    typeIn = (typeof type == 'string') ? type : type.toString();
    if(
      (typeof typeOut == 'string') &&
      (typeOut.length > 1) &&
      (typeIn.length > 1)
    ) {
      if(!(`${typeIn}->${typeOut}` in converts)) throw new Error('No such convertation');
    }
    return this;
  },
  to: function to(type) {
    typeOut = (typeof type == 'string') ? type : type.toString();
    if(
      (typeof typeIn == 'string') &&
      (typeIn.length > 1) &&
      (typeOut.length > 1)
    ) {
      if(!(`${typeIn}->${typeOut}` in converts)) throw new Error('No such convertation');
    }
    return this;
  },
  out: function out(filename) {
    if(typeof string == 'string') {
      return new Promise((res, rej) => {
        fs.writeFile(filename, converts[`${typeIn}->${typeOut}`](string), (err) => {
          if(err) rej(err);
          else res();
        })
        delete string;
      });
    } else {
      return new Promise((res, rej) => {
        readed
          .then((string) => converts[`${typeIn}->${typeOut}`](string))
          .then((string) => {
            fs.writeFile(filename, string, (err) => {
              if(err) rej(err);
              else res();
            })
          }, (err) => {
            rej(err);
          });
      });
    }
  },
  options: function options(obj) {
    return this;
  }
};