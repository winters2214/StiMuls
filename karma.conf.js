const webpackConfig = require("./webpack.config")()

const config = {
  browsers: ["Chrome", "Firefox", "Safari"],

  frameworks: ["qunit"],

  reporters: ["progress"],

  files: [
    { pattern: "test/**/*_test.ts" }
  ],

  preprocessors: {
    "test/**/*.ts": ["webpack"]
  },

  mime: {
    "text/x-typescript": ["ts"]
  },

  webpack: {
    module: webpackConfig.module,
    resolve: webpackConfig.resolve
  }
}

if (process.env.CI) {
  config.customLaunchers = {
    sl_chrome: {
      base: "SauceLabs",
      browserName: "chrome",
      version: "56"
    },
    sl_firefox: {
      base: "SauceLabs",
      browserName: "firefox",
      version: "51"
    },
    sl_safari: {
      base: "SauceLabs",
      browserName: "safari",
      platform: "macOS 10.12",
      version: "10.0"
    },
    sl_edge: {
      base: "SauceLabs",
      browserName: "edge",
      platform: "Windows 10",
      version: "14.14393"
    }
  }
  config.browsers = Object.keys(config.customLaunchers)
  config.sauceLabs = { testName: "Stimulus Browser Tests" }
  config.reporters = ["dots", "saucelabs"]
  config.singleRun = true
}

module.exports = function(karmaConfig) {
  karmaConfig.set(config)
}
