const webpack = require('webpack'),
  CircularDependencyPlugin = require('circular-dependency-plugin');


module.exports = {
  entry: {
    app: './app/src/app.ts',
    vendor: [
      'react',
      'lodash',
      'moment',
      'react-dom',
      'classnames',
      'tween.js'
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor-bundle.js', Infinity),
    // new CircularDependencyPlugin({
    //   exclude: /a\.js/
    // })
  ],
  devtool: 'eval',
  output: {
    path: 'app/build/src/',
    filename: '[name]-bundle.js'
  },
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    loaders: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' },
      // { test: /\.ts?$/, loader: 'ts-loader' },
      { test: /\.json?$/, loader: 'json-loader' },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};