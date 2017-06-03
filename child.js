// @flow
'use strict';

const unsafe_require = require;

process.title = 'projector-child';
process.stdin.setEncoding('utf8');

let [script, exportName] = process.argv.slice(2);

let stdin = '';
process.stdin.on('data', chunk => {
  stdin += chunk;
});

process.stdin.on('end', () => {
  let opts = JSON.parse(stdin);
  let mod = unsafe_require(script);
  let fn = mod[exportName];

  if (!fn) {
    throw new Error(`Module "${script}" does not have export named "${exportName}"`);
  }

  fn(opts).then(res => {
    process.stdout.write(JSON.stringify(res));
    process.exit(0);
  }).catch(err => {
    process.stderr.write(err.stack);
    process.exit(1);
  });
});
