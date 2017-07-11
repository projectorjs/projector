'use strict';

const path = require('path');
const projector = require('./');

const FIXTURE = path.join(__dirname, 'fixture.js');
const SUCCESS_EXPORT = 'SUCCESS_EXPORT';
const FAILURE_EXPORT = 'FAILURE_EXPORT';
const MISSING_EXPORT = 'MISSING_EXPORT';
const MOCK_OPTIONS = { foo: 'bar' };
const MOCK_ERROR = 'MOCK_ERROR';

let expectError = () => {
  throw new Error('Promise should have errored instead of fulfilling.');
};

test('on success', () => {
  return projector(FIXTURE, SUCCESS_EXPORT, MOCK_OPTIONS).then(result => {
    expect(result.MOCK_RUN).toBe(true);
    expect(result.MOCK_OPTIONS).toEqual(MOCK_OPTIONS);
  });
});

test('on failure', () => {
  return projector(FIXTURE, FAILURE_EXPORT, MOCK_OPTIONS).then(expectError, err => {
    expect(err.message).toEqual(MOCK_ERROR);
  });
});

test('on missing export', () => {
  return projector(FIXTURE, MISSING_EXPORT, MOCK_OPTIONS).then(expectError, err => {
    expect(err.message).toContain(`Module "${FIXTURE}" does not have export named "${MISSING_EXPORT}"`);
  });
});
