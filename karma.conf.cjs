module.exports = function (config) {
  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    plugins: [
      require('karma-jasmine'),
      require('karma-firefox-launcher'),
      require('karma-esbuild')
    ],

    files: [
      { pattern: 'src/**/*.spec.js', watched: true },
      { pattern: 'src/**/*.spec.jsx', watched: true }
    ],

    preprocessors: {
      'src/**/*.spec.js': ['esbuild'],
      'src/**/*.spec.jsx': ['esbuild']
    },

    // 5. Configuración de esbuild
    esbuild: {
      target: 'es2022',
      jsx: 'automatic',
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx'
      },
      bundle: true,
      sourcemap: 'inline'
    },

    reporters: ['progress'],

    // 6. Navegador Firefox
    browsers: ['Firefox'],

    singleRun: true,
    autoWatch: false,

    // Red y puertos
    hostname: '127.0.0.1',
    port: 9877,
    listenAddress: '127.0.0.1',

    colors: true,
    logLevel: config.LOG_INFO,
    concurrency: 1,
  });
};