/**
 * Imports.
 */
var Controller = require('microscope-web').Controller;
var passport   = require('passport');

/**
 * HomeController class.
 */
module.exports = GithubController = Controller.extend({

    baseUrl: "/user/github",

    routes: {
        'get /'         : passport.authenticate('github'),
        'get /callback' : 'githubAuth'
    },

    /**
     * GET
     * handle github authentication.
     */
    githubAuth: passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/user/login'
    }),
});
