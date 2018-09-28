const merge = require('webpack-merge');
const base = require('./webpack.base.js');
const webpack = require('webpack')

module.exports = merge(base, {
  output: {
    filename: 'iot_sdk.miniprogram.js',
  },
  externals: {
  },
  plugins: [
    new webpack.IgnorePlugin(/^(axios|ws)$/)
  ]
});