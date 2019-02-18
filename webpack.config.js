const path = require("path");
const webpack = require("webpack");
const { TsConfigPathsPlugin } = require("awesome-typescript-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WebappWebpackPlugin = require("webapp-webpack-plugin");
const OpenBrowserPlugin = require("open-browser-webpack4-plugin");

const ReloadBrowserPlugin = require("./plugins/reload-browser/reloadBrowserPlugin");
const ExitPlugin = require("./plugins/exit/exitPlugin");

const getConfiguration = (local, fallback, production) => {
  const mode = process.env["MODE"];

  if (mode === "local") {
    return local;
  } else if (mode === "staging") {
    return fallback;
  } else if (mode === "production") {
    return production || fallback;
  }
};

module.exports = {
  mode: getConfiguration("development", "production"),
  devtool: getConfiguration("source-map", "none"),
  target: "web",

  stats: getConfiguration(
    // "none",
    {
      all: false,
      modules: true,
      maxModules: 0,
      errors: true,
      warnings: true,
      moduleTrace: true,
      errorDetails: true,
    },
    "normal",
  ),
  watchOptions: {
    aggregateTimeout: 500,
  },

  entry: {
    main: "./src/frontend/main.tsx",
  },

  output: {
    path: path.resolve(__dirname, "./dist/public"),
    filename: getConfiguration("js/[name].js", "js/[contenthash].js"),
    publicPath: "/",
  },

  resolve: {
    extensions: [
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".scss",
      ".woff",
      ".png",
      ".svg",
    ],
    plugins: [new TsConfigPathsPlugin()],
  },

  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
          { loader: "postcss-loader" },
          {
            loader: "sass-loader",
            options: {
              includePaths: ["./src/frontend/styles"],
            },
          },
        ],
      },
      {
        test: /\.(tsx|ts)$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
            },
          },
          {
            loader: "awesome-typescript-loader",
            options: {
              silent: true,
              useCache: true,
              cacheDirectory: "./.cache/awesome-typescript-loader",
            },
          },
        ],
      },
      {
        test: /\.(png|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "./assets/images",
              name: getConfiguration("[name].[ext]", "[contenthash].[ext]"),
              publicPath: "/assets/images/",
            },
          },
        ],
      },
      {
        test: /\.(woff)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "./assets/fonts",
              name: getConfiguration("[name].[ext]", "[contenthash].[ext]"),
              publicPath: "/assets/fonts",
            },
          },
        ],
      },
      // ...getConfiguration(
      //   [],
      //   [
      //     {
      //       test: /\.(js|jsx)$/,
      //       use: [
      //         {
      //           loader: "babel-loader",
      //           options: {
      //             cacheDirectory: true,
      //           },
      //         },
      //       ],
      //     },
      //   ],
      // ),
    ],
  },

  optimization: getConfiguration(
    {},
    {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          terserOptions: {
            mangle: true,
            output: {
              comments: false,
            },
          },
        }),
      ],
      moduleIds: "hashed",
      chunkIds: "total-size",
      removeAvailableModules: true,
      removeEmptyChunks: true,
      mergeDuplicateChunks: true,
      flagIncludedChunks: true,
      occurrenceOrder: true,
      providedExports: true,
      usedExports: true,
      sideEffects: true,
      concatenateModules: true,

      runtimeChunk: "single",
      splitChunks: {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            filename: "js/vendors/[contenthash].js",
            name(module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
              )[1];

              // npm package names are URL-safe, but some servers don't like @ symbols
              return packageName.replace("@", "");
            },
          },
        },
      },
    },
  ),

  plugins: [
    ...getConfiguration(
      [new OpenBrowserPlugin({ url: "http://127.0.0.1:9090" })],
      [],
    ),
    new MiniCssExtractPlugin({
      filename: getConfiguration("css/[name].css", "css/[contenthash].css"),
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require("cssnano"),
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }],
      },
    }),
    new HtmlWebpackPlugin({
      template: "./src/frontend/index.html",
    }),
    ...getConfiguration(
      [
        new ReloadBrowserPlugin({
          port: 9999,
          host: "localhost",
        }),
      ],
      [],
    ),
    new WebappWebpackPlugin({
      logo: "./src/frontend/assets/images/logo.svg",
      cache: true,
      prefix: "/favicons/",
      inject: true,
    }),
    new CopyWebpackPlugin([
      {
        from: "./src/frontend/paths.config.json",
        to: "../paths.config.json",
      },
    ]),
    new Dotenv({
      path:
        "./src/frontend/" +
        getConfiguration(".env.local", ".env.staging", ".env.production"),
    }),
    ...getConfiguration([], [new ExitPlugin()]),
  ],
};
