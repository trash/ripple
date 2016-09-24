const webpack = require('webpack'),
  DashboardPlugin = require('webpack-dashboard/plugin');
// const CircularDependencyPlugin = require('circular-dependency-plugin');


module.exports = {
  entry: {
    app: './app/src/app.ts',
    vendor: [
      'react',
      'lodash',
      'moment',
      'react-dom',
      'classnames',
      'pixi.js',
      'tween.js'
    ]
  },

  node: {
    fs: 'empty'
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor-bundle.js', Infinity),
    new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
        exclude: [
            /vendor\/.+\.js/
        ]
    }),
    new DashboardPlugin(),
    // Stop the infinite locales from being loaded
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    // new CircularDependencyPlugin({
    //   exclude: /a\.js/
    // })
  ],
  devtool: 'eval',
  output: {
    path: 'app/build/src/',
    filename: '[name]-bundle.js',
    publicPath: '/assets/'
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
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  }
};