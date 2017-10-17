const path = require("path")
const webpack = require("webpack")

module.exports = {
  entry: {
    sentinella: "./src/index.ts"
  },

  output: {
    filename: "[name].js",
    path: path.resolve("./dist"),
    library: "Sentinella",
    libraryTarget: "umd"
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          { loader: "ts-loader" }
        ]
      }
    ]
  },

  resolve: {
    extensions: [".ts", ".js"],
    modules: ["src", "node_modules"]
  },

  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.BannerPlugin({
      banner: (() => {
        const { version } = require('./package.json')
        const year = new Date().getFullYear()
        return `/*\nSentinella ${version}\nCopyright © ${year} Basecamp, LLC\n */`
      })(),
      raw: true
    })
  ]
}
