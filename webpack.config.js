// const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require("path");

module.exports = {
  mode: 'development',
  entry: './mind.js',
  output: {
    path: path.resolve(__dirname,"dist"),
    library:"variableMind",// 在全局变量中增加一个library变量
    libraryTarget:"umd",
    libraryExport: "default"
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   title: '思维导图',
    //   template: '/index.html',
    // }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
}