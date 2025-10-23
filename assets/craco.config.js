module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Add Node.js polyfills for webpack 5
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "path": require.resolve("path-browserify"),
        "fs": false,
        "crypto": false,
        "stream": false,
        "util": false,
        "buffer": false,
        "process": false
      };

      return webpackConfig;
    },
  },
};
