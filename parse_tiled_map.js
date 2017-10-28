#!/usr/bin/env node

const fs = require('fs'),
      args = require('yargs')
          .boolean('no-decreasing')
          .alias('no-decreasing', 'n')
          .describe('no-decreasing', 'Don\'t decrease tiles. Just convert to buffer')
          .argv,
      SIZE = 32640;
if(args._.length < 1) {
    console.error('Usage:\ntic-tiled [options] file.json file.map');
    process.exit(1);
}
const fileIn = args._[0],
      fileOut = args._.length >= 2 ? args._[1] : require('path').basename(args._[0], '.json') + '.map'
let rawData;
try {
    rawData = JSON.parse(fs.readFileSync(fileIn)).layers[0].data;
} catch(e) {
    console.error('Error with reading file. ' +
                  'Make sure that file exist, ' +
                  'you has access to it ' +
                  'and it is valid JSON');
    process.exit(1);
}

let data = Array.from(rawData);
if(!args['no-decreasing']) data = data.map(x => Math.max(x - 1, 0));
data.length = SIZE;

try {
    fs.writeFileSync(fileOut, Buffer.from(data));
} catch(e) {
    console.error('Error with writing file. ' +
                  'Make sure that you has access to it');
    process.exit(1);
}
