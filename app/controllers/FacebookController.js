/**
 * Imports.
 */
var Controller = require('microscope-web').Controller;
var passport   = require('passport');

/**
 * HomeController class.
 */
module.exports = FacebookController = Controller.extend({

    baseUrl: "/user/facebook",

    routes: {
        'get /'         : passport.authenticate('facebook'),
        'get /callback' : 'facebookAuth'
    },

    /**
     * GET
     * handle facebook authentication.
     */
    facebookAuth: passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/user/login'
    }),
});
