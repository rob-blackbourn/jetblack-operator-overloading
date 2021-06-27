# @jetblack/operator-overloading

A Babel plugin for operator overloading.

There is a trivial template project [here](https://github.com/rob-blackbourn/example-operator-overloading).

This was based on an [idea](https://github.com/foxbenjaminfox/babel-operator-overload-plugin)
by [Benjamin Fox](https://github.com/foxbenjaminfox)

There are a number of great implementations of operator overloading including a
current [proposal](https://github.com/tc39/proposal-operator-overloading). This
proposal is far more sophisticated than this implementation, but I had issues
with my use case. This is a very simple version that worked for me and might
be a good work-around for you while we wait for the proposal to be accepted.

## Example

The following code adds two integers and then two points.

The directive at the start is required to enable the transformation.

```javascript
'operator-overloading enabled'

class Point {

    constructor(x, y) {
        this.x = x
        this.y = y
    }
    
    [Symbol.for('+')](other) {
        const x = this.x + other.x
        const y = this.y + other.y
        return new Point(x, y)
    }
}

// Built in operators still work.
const x1 = 2
const x2 = 3
const x3 = x1 + x2
console.log(x3)

// Overridden operators work!
const p1 = new Point(5, 5)
const p2 = new Point(2, 3)
const p3 = p1 + p2
console.log(p3)
```
produces the following output:
```bash
5
Point { x: 7, y: 8 }
```

## Status

This is the first babel plugin I have written, so your mileage may vary.

I would appreciate any help!

## Usage

1. Make a new folder and create a package.json file.

```bash
~$ mkdir my-app
~$ cd my-app
~/my-app$ npm init -y
```

2. Install babel and the basic preset (also `@babel/cli` for easier testing).

```bash
~/my-app$ npm install --save-dev @babel/core @babel/preset-env @babel/cli
```
3. Install the operator overload plugin. Note that `"node": "current"` is specified in targets. The targets specified **must** support arrow functions.

```bash
~/my-app$ npm install --save-dev @jetblack/operator-overloading
```
4. Create a `.babelrc` file:
```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets" : {
                    "node": "current"
                }
            }
        ]
    ],
    "plugins": ["module:@jetblack/operator-overloading"]
}
```

5. Write some code:

```javascript
'operator-overloading enabled'

class Point {

    constructor(x, y) {
        this.x = x
        this.y = y
    }
    
    [Symbol.for('+')](other) {
        const x = this.x + other.x
        const y = this.y + other.y
        return new Point(x, y)
    }
}

const p1 = new Point(5, 5)
const p2 = new Point(2, 3)
const p3 = p1 + p2
console.log(p3)
```

6. Run it with `babel-node`:

```bash
~/my-app$ ./node_modules/.bin/babel-node.cmd index.js
Point { x: 7, y: 8 }
```

## Description

The plugin wraps expressions in arrow functions. The following is produced for `x + y`.

```javascript
(() => {
  'operator-overloading disabled';

  return x !== undefined && x !== null && x[Symbol.for("+")]
    ? x[Symbol.for("+")](y)
    : x + y;
})()
```

For example the following code:
```javascript
let x = 1, y = 2
let z = x + y
```
gets re-written as:
```javascript
let x = 1, y = 2
let z = (() => {
  return x !== undefined && x !== null && x[Symbol.for("+")]
    ? x[Symbol.for("+")](y)
    : x + y;
})();
```

This allows the creation of custom overrides such as:
```javascript
class Point {

    constructor(x, y) {
        this.x = x
        this.y = y
    }
    
    [Symbol.For('+')](other) {
        const x = this.x + other.x
        const y = this.y + other.y
        return new Point(x, y)
    }
}
```

## Options

As the plugin requires arrow functions the `@babel/preset-env` preset `targets` must support them.

Operator overloading is disabled for all files by default.

This can be enabled globally in the `.babelrc`:
```json
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets" : {
                    "node": "current"
                }
            }
        ]
    ],
    "plugins": [
        [
            "@jetblack/operator-overloading",
            {
                "enabled": true
            }
        ]
    ]
}
```

It can be enabled or disabled locally by including the `'operator-overloading'` directive at the start of a file or within a block.

```javascript
'operator-overloading disabled'
let a = 1
let b = 2
let c = a + b

'operator-overloading enabled'
let x = Point(2, 4)
let y = Point(3, 5)
let z = x + y
```

Using operator overloading transpilation will increase compilation and run time when enabled.

## Unsupported operations

No transpilation will be applied to he following operators.

- `typeof`
- `===`
- `!==`
- `&&`
- `||`
- `instanceof`

## Supported operations

### Arithmetic

- `+` addition `[Symbol.for('+')](other)`
- `-` subtraction `[Symbol.for('-')](other)`
- `*` multiplication `[Symbol.for('*')](other)`
- `/` division `[Symbol.for('/')](other)`
- `%` remainder `[Symbol.for('%')](other)`

### Arithmetic Unary

- `+`: plus `[Symbol.for('plus')]()`
- `-`: minus `[Symbol.for('minus')]()`

### Increment an Decrement
- `++` increment `[Symbol.for('prefix-increment')]()` and `[Symbol.for('postfix-increment')]()`
- `--` decrement `[Symbol.for('prefix-decrement')]()` and `[Symbol.for('postfix-decrement')]()`

### Arithmetic Assignment

Arithmetic assignment reuses the overrides for arithmetic.

- `+=` addition assignment `[Symbol.for('+')](other)`
- `-=` subtraction assignment `[Symbol.for('-')](other)`
- `*=` multiplication assignment `[Symbol.for('*')](other)`
- `/=` division assignment `[Symbol.for('/')](other)`
- `%=` remainder assignment `[Symbol.for('%')](other)`

### Bitwise

- `&` bitwise and `[Symbol.for('&')](other)`
- `|` bitwise or `[Symbol.for('|')](other)`
- `~` bitwise not `[Symbol.for('~')]()`
- `^` bitwise xor `[Symbol.for('^')](other)`
- `<<` bitwise shift left `[Symbol.for('<<')](other)`
- `>>` bitwise sign propagating shift right `[Symbol.for('>>')](other)`
- `>>>` bitwise zero padding shift right `[Symbol.for('>>>')](other)`

### Bitwise Assignment

Bitwise assignment reuses the overrides for bitwise.

- `&=` bitwise and `[Symbol.for('&')](other)`
- `|=` bitwise or `[Symbol.for('|')](other)`
- `~=` bitwise not `[Symbol.for('~')]()`
- `^=` bitwise xor `[Symbol.for('^')](other)`
- `<<=` bitwise shift left `[Symbol.for('<<')](other)`
- `>>=` bitwise sign propagating shift right `[Symbol.for('>>')](other)`
- `>>>=` bitwise zero padding shift right `[Symbol.for('>>>')](other)`

### Others

- `delete` delete property `[Symbol.for('delete')](key)`
- `in` has property `[Symbol.for('in')](key)`
