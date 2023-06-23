const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript"
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshPlugin(),
    new TerserPlugin()
  ],
  devServer: {
    static: {
      directory: "./dist"
    },
    hot: true
  },
  resolveLoader: {
    modules: ["node_modules", "./webpack/loaders"],
    extensions: [".js", ".json"],
    mainFields: ["loader", "main"]
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM"
  }
};
