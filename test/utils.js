import assert from 'assert'
import {transform} from '@babel/core'

function trim(str) {
  return str.replace(/^\s+|\s+$/, '')
}

export function runTests(tests) {
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
