const LEGACY_CONFIG = 'legacy'
const MODERN_CONFIG = 'modern'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageminWebpWebpackPlugin= require('imagemin-webp-webpack-plugin')

const pkg = require('./package.json');
const settings = require('./webpack.settings')
const commonConfig = require('./webpack.common')

const configureStyleLoaders = (buildType) => {

  // Build the css during the modern build
  if (buildType === LEGACY_CONFIG) {
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

  // Don't build css for modern build
  // we do it only once during
  // the first/legacy build
  if (buildType === MODERN_CONFIG) {
    return {
      test: /\.s[ac]ss$/i,
      use: 'ignore-loader'
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
        },
        {
          loader: 'image-webpack-loader',
          options: {
            mozjpeg: {
              progressive: true,
              quality: 70
            },
            // optipng.enabled: false will disable optipng
            optipng: {
              enabled: false,
            },
            pngquant: {
              quality: [0.65, 0.90],
              speed: 4
            },
            gifsicle: {
              interlaced: false,
            }
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

// Configure Banner Comment
const configureBanner = () => {
  return {
    banner: `
    /*!
     * @project ${settings.name}
     * @name [filebase]
     * @author ${pkg.author}
     *
     */
    `,
    raw: true,
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
        configureStyleLoaders(LEGACY_CONFIG),
        configureImageLoader(LEGACY_CONFIG)
      ]
    },
    plugins: [
      new ImageminWebpWebpackPlugin(),
      new MiniCssExtractPlugin({
        path: path.resolve(__dirname, settings.paths.dist.base),
        filename: path.join('./css', '[name].[chunkhash].css')
      }),
      new webpack.BannerPlugin(
          configureBanner()
      ),
    ]
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
        configureStyleLoaders(MODERN_CONFIG),
        configureImageLoader(MODERN_CONFIG)
      ]
    },
    plugins: [
      new webpack.BannerPlugin(
          configureBanner()
      ),
      new CleanWebpackPlugin()
    ]
  })
]
