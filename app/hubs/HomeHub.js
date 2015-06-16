/**
 * Imports
 */
var Hub = require('microscope-web').Hub;

/**
 * Home hub
 * Simple chat hub with room.
 */
module.exports = HomeHub = Hub.extend({

  namespace: '/',

  routes: {
    'message': 'message',
    'newuser': 'newuser'
  },

  newuser: function (username) {
    this.io.emit('newuser', username);
  },

  message: function (data) {
    this.io.emit('message', {user: data.user, msg: data.msg});
  }
});