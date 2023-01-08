const babel = require("@babel/core");

const result = babel.transformFileSync(
  './examples/src/index.js',
  {
    presets: [
      [
        '@babel/preset-env',
        {targets: { node: "current"}}
      ]
    ],
    plugins: [
      ['./src', {"enabled": true}]
    ]
  })
console.log(result.code)

