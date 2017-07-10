// @flow
'use strict';

const path = require('path');
const {spawn} = require('child_process');

const CHILD_SCRIPT = path.join(__dirname, 'child.js');

/*::
type Serializeable =
  | null
  | number
  | boolean
  | string
  | Array<Serializeable>
  | SerializeableObject;

type SerializeableObject = {
  [key: string]: Serializeable,
};
*/

class StreamError extends Error {
  /*::
  code: number;
  stderr: string;
  */
  constructor(message, code, stderr) {
    super(message);
    this.code = code;
    this.stderr = stderr;
  }
}

function projector(script /*: string */, exportName /*: string */, opts /*: SerializeableObject */ = {}) {
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
        reject(new StreamError('Process errored with non-zero exit code.', code, stderr));
      }
    });
  
    child.stdin.setDefaultEncoding('utf8');
    child.stdin.write(JSON.stringify(opts));
    child.stdin.end();
  });
}

module.exports = projector;
