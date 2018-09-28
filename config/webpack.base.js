const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: path.join(__dirname, '../src/sdk.js'),
  output: {
    path: path.join(__dirname, '../dist'),
    libraryTarget: "umd",
    library: "TencentIotSdk"
  },
  plugins: [
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};