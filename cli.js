#!/usr/bin/env node

const args = require('yargs').argv;
if (args._.length < 2) {
  console.error('Usage:\ntic2tiled file.inExt file.outExt');
  process.exit(1);
}
const path = require('path'),
  fileIn = args._[0],
  fileInExt = path.extname(fileIn).slice(1),
  fileOut = args._[1],
  fileOutExt = path.extname(fileOut).slice(1);

require('./tic2tiled').file(`./${fileIn}`).from(fileInExt).to(fileOutExt).out(`./${fileOut}`);

console.log(`${fileIn} converted to ${fileOut}`); 
