#!/usr/bin/env node
const childProcess = require('child_process');

const args = process.argv.slice(2);
const scriptNames = ['add-page', 'add-page-group', 'init'];
const scriptIndex = args.findIndex(x => scriptNames.includes(x));
const script = scriptIndex === -1 ? args[0] : args[scriptIndex];

if (scriptNames.includes(script)) {
  childProcess.execSync(
    ['node', require.resolve('./' + script), ...args.slice(scriptIndex + 1)].join(' ')
  );
}
