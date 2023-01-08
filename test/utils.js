const assert = require('assert')
const {transform} = require('@babel/core')

function trim(str) {
  return str.replace(/^\s+|\s+$/, '')
}

function runTests(tests) {
  tests.map(({description, operation, expectation}) => {
    it(description, () => {
      const actual = transform(
        operation,
        {
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' }}]
          ],
          plugins: [
            ['./src', {"enabled": true}]
          ]
        })
        console.log(actual.code)
        assert.equal(trim(actual.code), trim(expectation))
    })
  })
}

module.exports = {
  runTests
}
