/**
 * Imports.
 */
var Controller = require('microscope-web').Controller;
var passport   = require('passport');

/**
 * HomeController class.
 */
module.exports = TwitterController = Controller.extend({

    baseUrl: "/user/twitter",

    routes: {
        'get /'         : passport.authenticate('twitter'),
        'get /callback' : 'twitterAuth'
    },

    /**
     * GET
     * handle twitter authentication.
     */
    twitterAuth: passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/user/login'
    }),
});
