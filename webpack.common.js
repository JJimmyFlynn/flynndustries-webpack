const path = require('path')
const pkg = require('./package.json')
const settings = require('./webpack.settings')

const merge = require('webpack-merge')

const ManifestPlugin = require('webpack-manifest-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const WebpackNotifierPlugin = require('webpack-notifier')
const CopyPlugin = require('copy-webpack-plugin')

// Creates entries object from entries
// listed in the settings file
const configureEntries = () => {
  const entries = {}
  for (const [name, fileName] of Object.entries(settings.entries)) {
    entries[name] = path.resolve(__dirname, settings.paths.src.js + fileName)
  }

  return entries
}

const configureBabelLoader = (browserList) => {
  return {
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'usage',
              corejs: {
                version: 3,
                proposals: true
              },
              targets: browserList
            }
          ]
        ],
        plugins: ['@babel/plugin-syntax-dynamic-import']
      }
    }
  }
}

const baseConfig = {
  entry: configureEntries(),
  module: {
    rules: [
      // Vue Loader
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    // Vue Loader Required Plugin Component
    new VueLoaderPlugin(),
    // File Copying for Images
    new CopyPlugin([
      {
        from: settings.paths.src.images,
        to: settings.paths.dist.images,
        toType: 'dir'
      }
    ]),
    // Build Notifications
    new WebpackNotifierPlugin({
      excludeWarnings: true,
      skipFirstNotification: true
    })
  ]
}

const legacyConfig = {
  module: {
    rules: [
      // Babel Loader
      configureBabelLoader(Object.values(pkg.browserslist.legacyBrowsers))
    ]
  },
  plugins: [
    new ManifestPlugin({
      fileName: 'manifest-legacy.json'
    })
  ]
}

const modernConfig = {
  module: {
    rules: [
      // Babel Loader
      configureBabelLoader(Object.values(pkg.browserslist.modernBrowsers))
    ]
  },
  plugins: [
    new ManifestPlugin({
      fileName: 'manifest.json'
    })
  ]
}

module.exports = {
  legacyConfig: merge([baseConfig, legacyConfig]),
  modernConfig: merge([baseConfig, modernConfig])
}
