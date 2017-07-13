// @flow
'use strict';

const path = require('path');
const child = require('child_process');

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

function projector(script /*: string */, exportName /*: string */, args /*: Array<SerializeableObject> */ = []) {
  return new Promise((resolve, reject) => {
    let proc = child.fork(CHILD_SCRIPT, {
      silent: false
    });

    proc.on('message', ({ status, payload }) => {
      if (status === 'ready') {
        proc.send({ script, exportName, args });
      } else if (status === 'complete') {
        resolve(payload);
      } else if (status === 'error') {
        let err = new Error(payload.message);
        err.stack = payload.stack;
        reject(err);
      } else {
        reject(new Error('Recieved unknown message from child process.'));
      }
    });

    proc.on('close', () => {
      reject(new Error('Never recieved a response from child process.'));
    });
  });
}

module.exports = projector;
