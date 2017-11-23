const path = require(`path`);
const webpack = require(`webpack`);

module.exports = {
  entry: `./src/js/script.js`,
  output: {
    path: path.resolve(`./dist`),
    filename: `js/script.js`,
  },
  devtool: `sourcemap`,
  devServer: {
    contentBase: `./src`,
    historyApiFallback: true,
    hot: true,
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: `babel`
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
