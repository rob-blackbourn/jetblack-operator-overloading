import { runTests } from './utils'

describe('increment decrement', () => {
  runTests([
    {
      description: 'should pre-increment',
      operation: '++x',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && typeof x === 'object' && x[Symbol.for("prefix-increment")] ? x[Symbol.for("prefix-increment")]() : ++x;
})();`
    },
    {
      description: 'should pre-decrement',
      operation: '--x',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && typeof x === 'object' && x[Symbol.for("prefix-decrement")] ? x[Symbol.for("prefix-decrement")]() : --x;
})();`
    },
    {
      description: 'should post-increment',
      operation: 'x++',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && typeof x === 'object' && x[Symbol.for("postfix-increment")] ? x[Symbol.for("postfix-increment")]() : x++;
})();`
    },
    {
      description: 'should post-decrement',
      operation: 'x--',
      expectation: `"use strict";

(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && typeof x === 'object' && x[Symbol.for("postfix-decrement")] ? x[Symbol.for("postfix-decrement")]() : x--;
})();`
    },
  ])
})
