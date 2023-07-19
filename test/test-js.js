// node test-js.js
const fs = require('fs')

const snk = require('../dist/snk.js')
snk('ali1416', 3).then((res) => {
  fs.writeFileSync('E:/snk.svg', res[0])
  fs.writeFileSync('E:/snk.light.svg', res[1])
  fs.writeFileSync('E:/snk.dark.svg', res[2])
})
