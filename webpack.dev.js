const LEGACY_CONFIG = 'legacy'
const MODERN_CONFIG = 'modern'

const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')

const WebpackDashboardPlugin = require('webpack-dashboard/plugin')

const settings = require('./webpack.settings')
const commonConfig = require('./webpack.common')

// Configures settings for dev server
const configureDevServer = () => {
  return {
    public: 'http://localhost:8080',
    contentBase: path.resolve(__dirname, './templates'),
    host: 'localhost',
    port: 8080,
    https: false,
    hot: true,
    hotOnly: true,
    disableHostCheck: true,
    overlay: true,
    watchContentBase: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  }
}

// Configures loaders for scss and css
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

  if (buildType === MODERN_CONFIG) {
    return {
      test: /\.s[ac]ss$/i,
      use: [
        // Loads css into DOM for development
        {
          loader: 'style-loader',
        },
        {
          loader: 'vue-style-loader',
        },
        // Translates CSS into CommonJS
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            sourceMap: true
          }
        },
        // Resolve relative urls in css
        {
          loader: 'resolve-url-loader'
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

// Configure Image loader
const configureImageLoader = (buildType) => {
  if (buildType === LEGACY_CONFIG) {
    return {
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: `${settings.paths.dist.images}/[name].[hash].[ext]`
          }
        }
      ]
    }
  }
  if (buildType === MODERN_CONFIG) {
    return {
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: `${settings.paths.dist.images}/[name].[hash].[ext]`
          }
        }
      ]
    }
  }
}

module.exports = [
  // Legacy config
  merge(commonConfig.legacyConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: configureDevServer(),
    output: {
      path: path.resolve(__dirname, settings.paths.dist.base),
      filename: path.join('./js', '[name]-legacy.[hash].js')
    },
    module: {
      rules: [
        configureStyleLoaders(LEGACY_CONFIG),
        configureImageLoader(LEGACY_CONFIG)
      ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new WebpackDashboardPlugin()
    ]
  }),
  // Modern Config
  merge(commonConfig.modernConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: configureDevServer(),
    output: {
      path: path.resolve(__dirname, settings.paths.dist.base),
      filename: path.join('./js', '[name].[hash].js')
    },
    module: {
      rules: [
        configureStyleLoaders(MODERN_CONFIG),
        configureImageLoader(MODERN_CONFIG)
      ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
  })
]
