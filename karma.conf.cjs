module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],

    files: [
      { pattern: 'src/**/*.js', type: 'module' },
      { pattern: 'src/**/*.spec.js', type: 'module' }
    ],

    reporters: ['progress'],
    port: 9878,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [],
    singleRun: false
  });
};