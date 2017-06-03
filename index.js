'use strict';

const path = require('path');
const {spawn} = require('child_process');

const CHILD_SCRIPT = path.join(__dirname, 'child.js');

function projector(script /*: string */, exportName/*: string */, opts = {}) {
  return new Promise((resolve, reject) => {
    let child = spawn('node', [CHILD_SCRIPT, script, exportName]);

    let stdout = '';
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', chunk => {
      stdout += chunk.toString();
    });

    let stderr = '';
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', chunk => {
      stderr += chunk.toString();
    });

    child.on('close', code => {
      if (code === 0) {
        resolve(stdout ? JSON.parse(stdout) : {});
      } else {
        let err = new Error('Process errored with non-zero exit code.');
        err.code = code;
        err.stderr = stderr;
        reject(err);
      }
    });

    child.stdin.setEncoding('utf8');
    child.stdin.write(JSON.stringify(opts));
    child.stdin.end();
  });
}

module.exports = projector;
