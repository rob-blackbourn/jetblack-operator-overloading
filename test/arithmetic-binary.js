import { runTests } from './utils'

describe('arithmetic binary', () => {
  runTests([
    {
      description: 'should transpile addition',
      operation: 'x + y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("+")] ? x[Symbol.for("+")](y) : x + y;
})();`
    },
    {
      description: 'should transpile subtraction',
      operation: 'x - y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("-")] ? x[Symbol.for("-")](y) : x - y;
})();`
    },
    {
      description: 'should transpile multiplication',
      operation: 'x * y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("*")] ? x[Symbol.for("*")](y) : x * y;
})();`
    },
    {
      description: 'should transpile division',
      operation: 'x / y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("/")] ? x[Symbol.for("/")](y) : x / y;
})();`
    },
    {
      description: 'should transpile remainder',
      operation: 'x % y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("%")] ? x[Symbol.for("%")](y) : x % y;
})();`
    },
    {
      description: 'should transpile exponent',
      operation: 'x ** y',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("**")] ? x[Symbol.for("**")](y) : x ** y;
})();`
    },
  ])
})
