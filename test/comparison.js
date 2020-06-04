import { runTests } from './utils'

describe('comparison', () => {
  runTests([
    {
      description: 'should transpile equal to comparison',
      operation: 'x == y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("==")] ? x[Symbol.for("==")](y) : x == y;
})();`
    },
    {
      description: 'should transpile not equal to comparison',
      operation: 'x != y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("!=")] ? x[Symbol.for("!=")](y) : x != y;
})();`
    },
    {
      description: 'should transpile less than comparison',
      operation: 'x < y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("<")] ? x[Symbol.for("<")](y) : x < y;
})();`
    },
    {
      description: 'should transpile less than or equal to comparison',
      operation: 'x <= y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("<=")] ? x[Symbol.for("<=")](y) : x <= y;
})();`
    },
    {
      description: 'should transpile greater than comparison',
      operation: 'x > y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for(">")] ? x[Symbol.for(">")](y) : x > y;
})();`
    },
    {
      description: 'should transpile greater than or equal to comparison',
      operation: 'x >= y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for(">=")] ? x[Symbol.for(">=")](y) : x >= y;
})();`
    },
    {
      description: 'should not transpile equal and same type comparison',
      operation: 'x === y',
      expectation: `"use strict";

x === y;`
    },
    {
      description: 'should not transpile not same type and equal type comparison',
      operation: 'x === y',
      expectation: `"use strict";

x === y;`
    },
  ])
})
