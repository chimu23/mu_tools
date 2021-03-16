/*
 * @Author: your name
 * @Date: 2020-12-04 16:00:16
 * @LastEditTime: 2021-01-20 10:02:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mu\webpack.config.js
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'production',
  // mode: 'development',
  entry: {
    mu: './src/mu/index.js',
    mu_mobile: './src/mu_mobile/index.js',
  },
  output: {
    filename: '[name].js',
    // filename: 'mu.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'mu',
    libraryTarget: 'umd',
    libraryExport: 'default',
    // publicPath: '/dist/'
  },
  devServer: {
    contentBase: '/dist',
    port: 8181,
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      template: './src/mu/index.html',
      filename: '/mu/index.html',
      chunks: ['mu'],
    }),
    new HtmlWebpackPlugin({
      template: './src/mu_mobile/index.html',
      filename: '/mu_mobile/index.html',
      chunks: ['mu_mobile'],
      minify: {
        removeComments: true, //去除注释
        collapseWhitespace: true, //去除空格
        removeAttributeQuotes: true, //移除属性的引号}
      },
    }),
  ],
  // devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(svg|jpg|jpeg|gif|png|)$/,
        use: 'url-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
