// @flow
'use strict';

const isPromise = require('is-promise');
const unsafe_require /*: any */ = require;
const unsafe_process /*: any */ = process;

process.title = 'projector-child';

if (typeof process.send !== 'function') {
  throw new Error('Must execute with an IPC channel, i.e. process.fork()');
}

function send(status, payload) {
  unsafe_process.send({ status, payload });
}

function close(status, payload) {
  send(status, payload);
  unsafe_process.disconnect();
}

function error(err) {
  close('error', {
    message: err.message,
    stack: err.stack,
  });
}

process.on('message', ({ script, exportName, args }) => {
  try {
    let mod = unsafe_require(script);
    let fn = mod[exportName];

    if (!fn) {
      error(new Error(`Module "${script}" does not have export named "${exportName}".`));
      return;
    }

    if (typeof fn !== 'function') {
      error(new Error(`Module "${script}" export "${exportName}" is not a function.`));
      return;
    }

    let ret = fn(...args);

    if (!isPromise(ret)) {
      error(new Error(`Module "${script}" export "${exportName}" did not return a promise.`));
      return;
    }

    ret.then(res => {
      close('complete', res);
    }).catch(err => {
      error(err);
    });
  } catch (err) {
    error(err);
    return;
  }
});

send('ready');
