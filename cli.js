#!/usr/bin/env node

const args = require('yargs').argv;
if (args._.length < 2) {
  console.error('Usage:\ntic2tiled file.inExt file.outExt');
  process.exit(1);
}
const path = require('path'),
  fileIn = args._[0],
  fileInExt = path.extname(fileIn),
  fileOut = args._[1],
  fileOutExt = path.extname(fileOut)

require('./tic2tiled').file(`./${fileIn}`).from(fileInExt).to(fileOutExt).out(`./${fileOut}`);