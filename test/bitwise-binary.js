import { runTests } from './utils'

describe('bitwise binary', () => {
  runTests([
    {
      description: 'should transpile bitwise and',
      operation: 'x & y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("&")] ? x[Symbol.for("&")](y) : x & y;
})();`
    },
    {
      description: 'should transpile bitwise or',
      operation: 'x | y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("|")] ? x[Symbol.for("|")](y) : x | y;
})();`
    },
    {
      description: 'should transpile bitwise xor',
      operation: 'x ^ y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("^")] ? x[Symbol.for("^")](y) : x ^ y;
})();`
    },
    {
      description: 'should transpile left shift',
      operation: 'x << y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("<<")] ? x[Symbol.for("<<")](y) : x << y;
})();`
    },
    {
      description: 'should transpile sign propagating right shift',
      operation: 'x >> y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for(">>")] ? x[Symbol.for(">>")](y) : x >> y;
})();`
    },
    {
      description: 'should transpile zero fill right shift',
      operation: 'x >>> y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for(">>>")] ? x[Symbol.for(">>>")](y) : x >>> y;
})();`
    },
  ])
})
