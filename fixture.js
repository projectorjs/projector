'use strict';

exports.SUCCESS_EXPORT = async (opts = {}) => {
  return { MOCK_RUN: true, MOCK_OPTIONS: opts };
};

exports.FAILURE_EXPORT = async (opts = {}) => {
  throw new Error('MOCK_ERROR');
};
