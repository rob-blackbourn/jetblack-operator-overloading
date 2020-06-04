import { runTests } from './utils'

describe('logical', () => {
  runTests([
    {
      description: 'should transpile logical and',
      operation: 'x && y',
      expectation: `"use strict";

x && y;`
    },
    {
      description: 'should transpile logical or',
      operation: 'x || y',
      expectation: `"use strict";

x || y;`
    },
  ])
})
