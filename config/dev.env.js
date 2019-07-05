'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://172.16.10.106:8080"',
  // DOWNLOAD_API:'"http://172.16.10.106:8080/pack3/"'
  BASE_API: '"http://172.16.3.212:8080"',
  DOWNLOAD_API:'"http://172.16.3.212:8080/pack3/"'

})
