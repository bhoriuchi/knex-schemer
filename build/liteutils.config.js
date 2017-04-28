var path = require('path')
var liteutils = require('liteutils')

var includes = [
  'forEach',
  'isHash',
  'map',
  'reduce'
]

liteutils({
  dash: {
    minify: false,
    dest: path.resolve(__dirname, '../src/liteutils.js'),
    include: includes
  }
})
.then(function () {
  console.log('Liteutils build completed')
})
.catch(console.error)