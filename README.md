# Flynndustries Webpack
This is a general webpack setup meant to be used with Craft CMS based sites, though it can be used with other setups
 with some slight modifications.
 
 All setup is done in `webpack.setting.js`


## Development
To begin developing your site run `npm run dev` which will spin up a local express server using webpack-dev-server
. This will enable hot module replacement and auto-refreshing of css. Webpack generated files are kept in memory when
 using the dev server instead of being written to the file system.
 
 ## Production Build
 To build for production run `npm run prod`. This will generate versioned css and javascript files in the resource
  root specified in the settings file. Two javascript bundles will be created, a modern and a legacy bundle. 
  
  The browsers that are taken into consideration for each of these bundles are specified in the `browserList
  ` property of `package.json`. The general idea is that the legacy bundle will contain transpiled and pollyfilled
   code for legacy browsers, and the modern build will not contain polyfills or much tranpilation with the assumption
    that modern browsers do not need help running modern javascript. This also make the bundle much smaller (yay!).
