/**
 * Imports
 */
var Application            = require('microscope-web').Application;
var commonsMidlw           = require('./middlewares/commons');
var rewriteMdlw            = require('./middlewares/rewrite');
var errorsMidlw            = require('./middlewares/errors');
var authenticationProvider = require('./middlewares/authenticationProvider');
var templateEngineProvider = require('./middlewares/templateEngineProvider');

/**
 * microscope application.
 */
var Server = Application.extend({

  appRoot: __dirname,
  startHubs: true,
  environment: 'dev',
  port: 3000,

  initialize: function () {
    this.errorHandlers();
    this.run(this.log.bind(this));
  },

  middlewares: [
    commonsMidlw.defaults,
    commonsMidlw.locals,
    commonsMidlw.flash,
    templateEngineProvider,
    authenticationProvider,
    rewriteMdlw.rewrite
  ],

  errorHandlers: function () {
    errorsMidlw(this.app);
  },

  log: function () {
    console.log('Gestiaweb est lançé avec le port ' + this.port + '!');
  }
});

module.exports = Server;
