#!/usr/bin/env node
const yargs = require('yargs');
const fs = require('fs');

let config = {};
try {
  fs.accessSync('srr-config.json');
  config = JSON.parse(fs.readFileSync('srr-config.json').toString());
} catch {}

yargs
  .commandDir('./commands', {
    exclude: /_utils\.js/
  })
  .options({
    root: {
      default: 'src',
      description: 'The root directory of your project',
      type: 'string'
    },
    ts: {
      default: false,
      description: 'Use TypeScript template',
      type: 'boolean'
    }
  })
  .config(config)
  .demandCommand(1, 1)
  .strict()
  .help()
  .argv


