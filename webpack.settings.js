module.exports = {
  name: 'Skibutlers Craft',
  paths: {
    src: {
      base: './src/',
      js: './src/',
      css: './src/styles/',
      images: './src/images/'
    },
    dist: {
      base: './build',
      images: './images'
    }
  },
  entries: {
    main: 'main.js'
  },
  urls: {
    live: 'https://example.com/',
    local: 'http://example.test/',
    critical: 'http://example.test/',
    publicPath: '/build/'
  }
}
