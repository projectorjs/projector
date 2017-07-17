'use strict';

const path = require('path');
const projector = require('./');

const FIXTURE = path.join(__dirname, 'fixture.js');
const MOCK_ARGS = [{ foo: 'bar' }];

let expectError = () => {
  throw new Error('Promise should have errored instead of fulfilling.');
};

test('projector(script)', () => {
  return projector(FIXTURE).then(res => {
    expect(res.MOCK_RUN).toBe(true);
    expect(res.EXPORT_NAME).toBe('default');
    expect(res.MOCK_ARGS).toEqual([]);
  });
});

test('projector(script, args)', () => {
  return projector(FIXTURE, MOCK_ARGS).then(res => {
    expect(res.MOCK_RUN).toBe(true);
    expect(res.EXPORT_NAME).toBe('default');
    expect(res.MOCK_ARGS).toEqual(MOCK_ARGS);
  });
});

test('projector(script, exportName)', () => {
  return projector(FIXTURE, 'named').then(res => {
    expect(res.MOCK_RUN).toBe(true);
    expect(res.EXPORT_NAME).toBe('named');
    expect(res.MOCK_ARGS).toEqual([]);
  });
});

test('projector(script, exportName, args)', () => {
  return projector(FIXTURE, 'named', MOCK_ARGS).then(res => {
    expect(res.MOCK_RUN).toBe(true);
    expect(res.EXPORT_NAME).toBe('named');
    expect(res.MOCK_ARGS).toEqual(MOCK_ARGS);
  });
});

test('error on non-string fixture', () => {
  expect(() => {
    projector(42);
  }).toThrow();
});

test('error on non-string export', () => {
  expect(() => {
    projector(FIXTURE, 42);
  }).toThrow();
});

test('error on non-array args', () => {
  expect(() => {
    projector(FIXTURE, 'default', 42);
  }).toThrow();
});

test('error on object args in export position', () => {
  expect(() => {
    projector(FIXTURE, {});
  }).toThrow();
});

test('on error', () => {
  return projector(FIXTURE, 'error', MOCK_ARGS).then(expectError, err => {
    expect(err.message).toEqual('MOCK_ERROR');
  });
});

test('on missing export', () => {
  return projector(FIXTURE, 'MISSING_EXPORT').then(expectError, err => {
    expect(err.message).toContain(`Module "${FIXTURE}" does not have export named "MISSING_EXPORT"`);
  });
});
