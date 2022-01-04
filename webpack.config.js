const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',  
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  stats: {
    colors: true
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    open: false, //是否弹出新窗口
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {test:/\.js$/, use:'babel-loader',exclude:/node_modules/},
    ]
  }
}