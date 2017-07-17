'use strict';

function record(name, ...args) {
  return new Promise(resolve => {
    resolve({
      MOCK_RUN: true,
      EXPORT_NAME: name,
      MOCK_ARGS: args,
    });
  });
}

exports.default = (...args) => {
  return new Promise(resolve => {
    resolve({
      MOCK_RUN: true,
      EXPORT_NAME: 'default',
      MOCK_ARGS: args,
    });
  });
};

exports.named = (...args) => {
  return new Promise(resolve => {
    resolve({
      MOCK_RUN: true,
      EXPORT_NAME: 'named',
      MOCK_ARGS: args,
    });
  });
};

exports.error = () => {
  return new Promise(() => {
    throw new Error('MOCK_ERROR');
  });
};
