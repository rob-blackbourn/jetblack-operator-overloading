import { runTests } from './utils'

describe('arithmetic unary', () => {
  runTests([
    {
      description: 'should transpile plus',
      operation: '+x',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("plus")] ? x[Symbol.for("plus")]() : +x;
})();`
    },
    {
      description: 'should transpile minus',
      operation: '-x',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("minus")] ? x[Symbol.for("minus")]() : -x;
})();`
    },
  ])
})
