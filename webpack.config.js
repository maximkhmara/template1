import util from 'gulp-util';
import webpack from 'webpack';
import path from 'path';
import ESLintPlugin from 'eslint-webpack-plugin';

const buildPath = path.resolve(__dirname, 'dist/js');
const production =
  process.env.NODE_ENV === 'production' ||
  util.env.production ||
  util.env.prod ||
  util.env._.indexOf('build') !== -1 ||
  false;
const mode = production ? 'production' : 'development';
const isProduction = mode === 'production';
const devtool = isProduction
  ? 'nosources-source-map'
  : 'cheap-module-source-map';

module.exports = {
  entry: {
    main: './src/js/main.js',
    // home: './src/js/home.js',
  },
  mode,
  devtool,
  optimization: {
    minimize: isProduction,
  },
  output: {
    filename: '[name].js',
    path: buildPath,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    ],
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.jQuery': 'jquery'
    // }),
    new ESLintPlugin({
      extensions: ['js'],
    }),
  ],
};
