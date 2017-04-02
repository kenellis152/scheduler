// Karma configuration
// Generated on Sun Apr 02 2017 11:00:30 GMT-0400 (Eastern Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      // {pattern: 'public/js/jquery/jquery-3.1.1.min.js', watch: false},
      // {pattern: 'public/js/angular/angular.min.js', watch: false},
      './node_modules/angular/angular.js',
      './public/js/plugins/oclazyload/dist/ocLazyLoad.min.js',
      './public/js/bootstrap/ui-bootstrap-tpls-1.1.2.min.js',
      './public/js/plugins/lodash/lodash.js',
      './node_modules/angular-mocks/angular-mocks.js',
      './node_modules/angular-ui-router/release/angular-ui-router.js',
      './node_modules/angular-animate/angular-animate.js',
      './node_modules/angular-aria/angular-aria.js',
      './node_modules/angular-messages/angular-messages.js',
      './node_modules/angular-material/angular-material.js',
      './node_modules/angular-material/angular-material-mocks.js',
      './public/js/app.js',
      './public/services/orders.service.js',
      './public/services/line.service.js',
      './public/services/plant.service.js',
      './public/services/selection.service.js',
      './public/services/spec.service.js',
      './public/services/orders.service.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
