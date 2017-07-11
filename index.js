// @flow
'use strict';

const path = require('path');
const crossSpawn = require('cross-spawn');

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

type SpawnOptions = {
  stdin?: string,
}
*/

class ChildError extends Error {
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

function spawn(bin /*: string */, args /*: Array<string> */, opts /*: SpawnOptions */ = {}) {
  return new Promise((resolve, reject) => {
    let spawned = crossSpawn(bin, args);

    let stdout = '';
    spawned.stdout.setEncoding('utf8');
    spawned.stdout.on('data', chunk => {
      stdout += chunk.toString();
    });

    let stderr = '';
    spawned.stderr.setEncoding('utf8');
    spawned.stderr.on('data', chunk => {
      stderr += chunk.toString();
    });

    spawned.on('close', code => {
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new ChildError('Process errored with non-zero exit code.', code, stderr));
      }
    });

    spawned.stdin.setDefaultEncoding('utf8');
    if (opts.stdin) spawned.stdin.write(opts.stdin);
    spawned.stdin.end();
  });
}

function projector(script /*: string */, exportName /*: string */, opts /*: SerializeableObject */ = {}) {
  return spawn('node', [CHILD_SCRIPT, script, exportName], {
    stdin: JSON.stringify(opts)
  }).then(stdout => {
    return stdout ? JSON.parse(stdout) : {};
  });
}

projector.spawn = spawn;
projector.ChildError = ChildError;

module.exports = projector;
