const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  // mode: 'production',
  mode: 'development',
  entry: {
    mu: './src/mu/index.js',
    mu_mobile: './src/mu_mobile/index.js',
  },
  output: {
    filename: '[name].js',
    // path: path.join(__dirname, '/dist'),  //join 路径只是简单拼接  resolve 处理后会返回绝对路径  如遇到/a  /b  则 /b覆盖 /a  https://blog.csdn.net/u010238381/article/details/80498646
    path: path.resolve('./dist'),
    library: 'mu',
    libraryTarget: 'umd',
    libraryExport: 'default',
    publicPath: 'www.baidu.com/', //配置公共路径 ./a.jpg => www.baidu.com/a.jpg
  },
  devServer: {
    contentBase: '/dist',
    port: 8181,
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      template: './src/mu/index.html',
      filename: 'mu/index.html',
      chunks: ['mu'],
    }),
    new HtmlWebpackPlugin({
      template: './src/mu_mobile/index.html',
      filename: 'mu_mobile/index.html',
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
