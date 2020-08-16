const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = (_, { hot, mode }) => {
  const devMode = mode !== 'production'

  return {
    // Entry point for the build and main file.
    entry: [
      './src/index.js'
    ],

    // Main output file.
    // In production the file name will come with contenthash,
    // this will allow the browser to cache the files
    // (https://webpack.js.org/guides/caching/).
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: (devMode && hot)
        ? '[name].[hash].js'
        : (devMode ? '[name].js' : '[name].[contenthash].js')
    },

    module: {
      rules: [
        // Rule for transpiling JavaScript files
        // from a more modern version of the language
        // to an older one, but supported by a greater number of browsers.
        // (https://github.com/babel/babel-loader)
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },

        // Rule to compile, unify and minify style files.
        // Sourcemaps will be generated for development mode only.
        // (https://webpack.js.org/plugins/mini-css-extract-plugin/)
        // (https://webpack.js.org/loaders/css-loader/)
        // (https://webpack.js.org/loaders/sass-loader/)
        {
          test: /\.(scss|sass)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: path.resolve(__dirname, 'dist')
              }
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: devMode
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: devMode
              }
            }
          ]
        },

        // Handles image files.
        // (https://webpack.js.org/loaders/file-loader/)
        // (https://webpack.js.org/loaders/url-loader/)
        {
          test: /\.svg$/,
          use: 'file-loader'
        },

        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ]
        }
      ]
    },

    // Settings for development server.
    // (https://webpack.js.org/configuration/resolve/)
    // (https://github.com/gaearon/react-hot-loader)
    // (https://webpack.js.org/configuration/dev-server/)
    resolve: {
      extensions: [
        '.js',
        '.jsx'
      ],
      alias: {
        'react-dom': '@hot-loader/react-dom'
      }
    },

    devServer: {
      contentBase: './dist'
    },

    plugins: [
      // Generates in the output.path an HTML file
      // as an entry point for application based on a template.
      // In production, the file name comes with the contenthash.
      // (https://webpack.js.org/plugins/html-webpack-plugin/)
      new HtmlWebpackPlugin({
        filename: devMode ? 'index.html' : 'index.[contenthash].html',
        template: './src/index.html'
      }),

      // This plugin will remove all files inside webpack's output.path
      // directory, as well as all unused webpack assets after
      // every successful rebuild.
      // (https://github.com/johnagan/clean-webpack-plugin)
      new CleanWebpackPlugin(),

      // This plugin extracts CSS into separate files.
      // (https://webpack.js.org/plugins/mini-css-extract-plugin/)
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[contenthash].css'
      }),

      ...(devMode ? [
        // Plugins for development mode only
      ] : [
        // Plugins for production mode only

        // It will search for CSS assets during the build
        // and will optimize\minimize them using cssnano.
        // (https://github.com/NMFR/optimize-css-assets-webpack-plugin)
        // (https://github.com/cssnano/cssnano)
        new OptimizeCssAssetsPlugin()
      ])
    ],

    // Specific optimization settings for node_modules.
    // (https://webpack.js.org/configuration/optimization/)
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      }
    }
  }
}
