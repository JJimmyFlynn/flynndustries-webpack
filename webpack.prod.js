const LEGACY_CONFIG = 'legacy'
const MODERN_CONFIG = 'modern'

const path = require('path')
const merge = require('webpack-merge')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const settings = require('./webpack.settings')
const commonConfig = require('./webpack.common')

const configureStyleLoaders = (buildType) => {
  // Don't build css for legacy build
  // we'll do it only once during
  // the modern build
  if (buildType === LEGACY_CONFIG) {
    return {
      test: /\.s[ac]ss$/i,
      use: 'ignore-loader'
    }
  }

  // Build the css during the modern build
  if (buildType === MODERN_CONFIG) {
    return {
      test: /\.s[ac]ss$/i,
      use: [
        // Extract css to its own file
        {
          loader: MiniCssExtractPlugin.loader
        },
        // Translates CSS into CommonJS
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            sourceMap: true
          }
        },
        // Run PostCSS Plugins
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        },
        // Compiles Sass to CSS
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }
      ]
    }
  }
}

module.exports = [
  // Legacy Config
  merge(commonConfig.legacyConfig, {
    mode: 'production',
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, settings.paths.dist.base),
      filename: path.join('./js', '[name]-legacy.[chunkhash].js')
    },
    module: {
      rules: [
        configureStyleLoaders(LEGACY_CONFIG)
      ]
    }
  }),
  // Modern Config
  merge(commonConfig.modernConfig, {
    mode: 'production',
    devtool: 'source-map',
    output: {
      path: path.resolve(__dirname, settings.paths.dist.base),
      filename: path.join('./js', '[name].[chunkhash].js')
    },
    module: {
      rules: [
        configureStyleLoaders(MODERN_CONFIG)
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        path: path.resolve(__dirname, settings.paths.dist.base),
        filename: path.join('./css', '[name].[chunkhash].css')
      })
    ]
  })
]
