/**
 * Imports.
 */
var Controller = require('microscope-web').Controller;
var passport   = require('passport');

/**
 * HomeController class.
 */
module.exports = GoogleController = Controller.extend({

    baseUrl: "/user/google",

    routes: {
        'get /'         : passport.authenticate('google'),
        'get /callback' : 'googleAuth'
    },

    /**
     * GET
     * handle google authentication.
     */
    googleAuth: passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/user/login'
    }),
});
