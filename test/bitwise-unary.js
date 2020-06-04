import { runTests } from './utils'

describe('bitwise unary', () => {
  runTests([
    {
      description: 'should transpile bitwise not',
      operation: '~x',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("~")] ? x[Symbol.for("~")]() : ~x;
})();`
    },
  ])
})
