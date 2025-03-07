const path = require('path');
const webpack = require('webpack');
const DashboardPlugin = require('webpack-dashboard/plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
var HappyPack = require('happypack');
var ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  entry: {
    app: './app/src/app.ts',
    mapgen: './app/src/mapgen-app.ts',
    vendor: [
      'react',
      'lodash',
      'moment',
      'react-dom',
      'pixi.js',
      'tween.js'
    ]
  },

  node: {
    fs: 'empty'
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor-bundle.js'
    }),
    new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
        exclude: [
            /vendor\/.+\.js/
        ]
    }),
    new DashboardPlugin(),
    // Stop the infinite locales from being loaded
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new HappyPack({
         id: 'ts',
         threads: 4,
         loaders: [
             {
                 path: 'ts-loader',
                 query: {
                   happyPackMode: true
                 }
             }
         ]
     }),
     new ForkTsCheckerWebpackPlugin()
    // new CircularDependencyPlugin({
    //   exclude: /a\.js/
    // })
  ],
  devtool: 'eval',
  output: {
    path: path.join(__dirname, 'app/build/src/'),
    filename: '[name]-bundle.js',
    publicPath: '/assets/'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    loaders: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'happypack/loader?id=ts' },
      // { test: /\.ts?$/, loader: 'ts-loader' },
      { test: /\.json?$/, loader: 'json-loader' },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};