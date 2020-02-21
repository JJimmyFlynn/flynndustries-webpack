module.exports = {
  name: 'Skibutlers Craft',
  paths: {
    src: {
      base: './assets/',
      js: './assets/scripts/',
      css: './assets/styles/',
      images: './assets/images/'
    },
    dist: {
      base: './web/dist',
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
    publicPath: () => process.env.PUBLIC_PATH || "/dist/"
  }
}
