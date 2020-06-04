import { runTests } from './utils'

describe('special', () => {
  runTests([
    {
      description: 'should transpile delete key',
      operation: 'delete x["y"]',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("delete")] ? x[Symbol.for("delete")]("y") : delete x["y"];
})();`
    },
    {
      description: 'should transpile delete property',
      operation: `delete x.y`,
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("delete")] ? x[Symbol.for("delete")]("y") : delete x.y;
})(); `
    },
    {
      description: 'should transpile in',
      operation: 'x in y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("in")] ? x[Symbol.for("in")](y) : x in y;
})();`
    },
    {
      description: 'should transpile instanceof',
      operation: 'x instanceof y',
      expectation: `"use strict";

x instanceof y;`
    },
    {
      description: 'should transpile void',
      operation: 'void x',
      expectation: `"use strict";

void x;`
    },
  ])
})
