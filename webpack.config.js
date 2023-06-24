const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const Dotenv = require('dotenv-webpack');
require('dotenv').config();

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },
  resolve: {
    fallback: {
        "fs": false,
        "path": false
    },
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
    new webpack.DefinePlugin({
      MECHA_STARK_WALLET_PRIVKEY: JSON.stringify(process.env.MECHA_STARK_WALLET_PRIVKEY),
    }),
    new Dotenv(),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshPlugin(),
    new TerserPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/assets", to: "assets" }
      ]
    })
  ],
  devServer: {
    static: {
      directory: "./dist"
    },
    port: 3000,
    hot: true
  },
  resolveLoader: {
    modules: ["node_modules", "./webpack/loaders"],
    extensions: [".js", ".json"],
    mainFields: ["loader", "main"]
  }
};
