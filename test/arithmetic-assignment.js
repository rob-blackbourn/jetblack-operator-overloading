import { runTests } from './utils'

describe('arithmetic assignment', () => {
  runTests([
    {
      description: 'should transpile assignment',
      operation: 'x = y',
      expectation: `"use strict";

x = y;`
    },
    {
      description: 'should transpile addition assignment',
      operation: 'x += y',
      expectation: `"use strict";

x = (() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("+")] ? x[Symbol.for("+")](y) : x + y;
})();`
    },
    {
      description: 'should transpile subtraction assignment',
      operation: 'x -= y',
      expectation: `"use strict";

x = (() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("-")] ? x[Symbol.for("-")](y) : x - y;
})();`
    },
    {
      description: 'should transpile multiplication assignment',
      operation: 'x *= y',
      expectation: `"use strict";

x = (() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("*")] ? x[Symbol.for("*")](y) : x * y;
})();`
    },
    {
      description: 'should transpile division assignment',
      operation: 'x /= y',
      expectation: `"use strict";

x = (() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("/")] ? x[Symbol.for("/")](y) : x / y;
})();`
    },
    {
      description: 'should transpile remainder assignment',
      operation: 'x %= y',
      expectation: `"use strict";

x = (() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("%")] ? x[Symbol.for("%")](y) : x % y;
})();`
    },
    {
      description: 'should transpile exponentation assignment',
      operation: 'x **= y',
      expectation: `"use strict";

x = (() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("**")] ? x[Symbol.for("**")](y) : x ** y;
})();`
    },
    {
      description: 'should transpile left shift assignment',
      operation: 'x <<= y',
      expectation: `"use strict";

x = (() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("<<")] ? x[Symbol.for("<<")](y) : x << y;
})();`
    },
    {
      description: 'should transpile right shift assignment',
      operation: 'x >>= y',
      expectation: `"use strict";

x = (() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for(">>")] ? x[Symbol.for(">>")](y) : x >> y;
})();`
    },
    {
      description: 'should transpile unsigned right shift assignment',
      operation: 'x >>>= y',
      expectation: `"use strict";

x = (() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for(">>>")] ? x[Symbol.for(">>>")](y) : x >>> y;
})();`
    },
    {
      description: 'should transpile unsigned bitwise and assignment',
      operation: 'x &= y',
      expectation: `"use strict";

x = (() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("&")] ? x[Symbol.for("&")](y) : x & y;
})();`
    },
    {
      description: 'should transpile bitwise xor assignment',
      operation: 'x ^= y',
      expectation: `"use strict";

x = (() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("^")] ? x[Symbol.for("^")](y) : x ^ y;
})();`
    },
    {
      description: 'should transpile bitwise or assignment',
      operation: 'x |= y',
      expectation: `"use strict";

x = (() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("|")] ? x[Symbol.for("|")](y) : x | y;
})();`
    },
  ])
})
