/** @module tic2tiled */
const fs = require('fs'),
  xml2js = require('xml2js'),
  parser = new xml2js.Parser(),
  SIZE = 32640,
  converts = {
    'map->tmx': function (str) {
      return new Promise((res, rej) => {
        fs.writeFileSync(`./tileset.tsx`, fs.readFileSync(`${__dirname}/default_data/tileset.tsx`));
        fs.readFile(`${__dirname}/default_data/default_map.tmx`, 'utf-8', tryReject(rej, (data) => {
          parser.parseString(data, tryReject(rej, (result) => {
            let tiles = result.map.layer[0].data[0].tile;
            let dataView = new DataView(Buffer.from(str, 'utf8').buffer);
            for (var i = 0; i < SIZE; i++) {
              tiles[i] = { '$': { gid: (dataView.getInt8(i) + 1).toString() } }
            }
            res((new xml2js.Builder()).buildObject(result));
          }))
        }))
      });
    },
    'tmx->map': function (str) {
      return new Promise((res, rej) => {
        parser.parseString(str, tryReject(rej, (result) => {
          let tiles = result.map.layer[0].data[0].tile;
          let data = new Int8Array(SIZE);
          for (var i = 0; i < data.length; i++) {
            data[i] = tiles[i].$.gid - 1;
          }
          res(Buffer.from(data));
        }))
      })
    }
  };
function tryReject(rej, cb) {
  return (err, data) => {
    if(err) {
      rej(err);
      return;
    }
    return cb(data);
  }
}
let options = {
  type: {
    in: null,
    out: null
  },
  data: null
}
function checkConvertation() {
  let { in: tIn, out: tOut} = options.type;
  if(tIn && tOut && tIn.length > 0 && tOut.length > 0) {
    if(!(`${tIn}->${tOut}`)) throw new Error('No such convertation');
  }
}
let string, typeIn, typeOut, readed;
module.exports = {
  /**
   *  Reads string for convertion from file
   *  @param {string} filename
   *  @see {@link string}
   *  @returns {this}
   */
  file: function file(filename) {
    options.data = new Promise((res, rej) => {
      fs.readFile(filename, 'utf-8', (err, data) => {
        if (err) rej(err);
        else res(data);
      })
    })
    return this;
  },
  /**
   *  Uses string from arguments for convertation
   *  @param {string} string
   *  @see {@link file}
   *  @returns {this}
   */
  string: function string(str) {
    options.data = Promise.resolve(str.toString());
    return this;
  },
  /**
   *  Set type from which need convert
   *  @param {string} type
   *  @see {@link to}
   *  @returns {this}
   */
  from: function from(type) {
    options.type.in = type.toString();
    checkConvertation();
    return this;
  },
  /**
   *  Set type to which need convert
   *  @param {string} type
   *  @see {@link from}
   *  @returns {this}
   */
  to: function to(type) {
    options.type.out = type.toString();
    checkConvertation();
    return this;
  },
  /**
   *  Converts and write result to file
   *  @param {string} filename
   *  @see {@link file}
   *  @see {@link string}
   *  @returns {Promise} Promise which resolved after writing in file
   */
  out: function out(filename) {
    return options.data
      .then((string) => converts[`${options.type.in}->${options.type.out}`](string))
      .then((string) =>
        new Promise((res, rej) =>
          fs.writeFile(filename, string, (err) => err ? rej(err) : res())
        )
      );
  },
  options: function options(obj) {
    return this;
  }
};
