const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


module.exports = {
  
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ],
  mode: 'development',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(s(a|c)ss)$/,
        use: ['style-loader','css-loader','sass-loader']
     }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve('../back/public')
  }
};