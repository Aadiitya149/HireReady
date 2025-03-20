const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    fs: false,
    stream: require.resolve("stream-browserify"),
    zlib: require.resolve("browserify-zlib"),
    process: require.resolve("process/browser"),
    buffer: require.resolve("buffer"),
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  return config;
};
