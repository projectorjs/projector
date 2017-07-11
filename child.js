// @flow
'use strict';

process.title = 'projector-child';

if (typeof process.send !== 'function') {
  throw new Error('Must execute with an IPC channel, i.e. process.fork()');
}

const unsafe_require = require;

function send(status, payload) {
  (process /*: any */).send({ status, payload });
}

function close(status, payload) {
  send(status, payload);
  (process /*: any */).disconnect();
}

function error(err) {
  close('error', {
    message: err.message,
    stack: err.stack,
  });
}

process.on('message', ({ script, exportName, opts }) => {
  let mod = unsafe_require(script);
  let fn = mod[exportName];

  if (!fn) {
    error(new Error(`Module "${script}" does not have export named "${exportName}"`));
    return;
  }

  fn(opts).then(res => {
    close('complete', res);
  }).catch(err => {
    error(err);
  });
});

send('ready');
