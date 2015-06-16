// Imports
var localStrategy          = require('./strategies/localStrategy');
//var googleStrategy         = require('./strategies/googleStrategy');
//var facebookStrategy       = require('./strategies/facebookStrategy');
//var twitterStrategy        = require('./strategies/twitterStrategy');
//var githubStrategy         = require('./strategies/githubStrategy');
var passport               = require('passport');

/**
 * serialize user
 * @param  {Object}   user
 * @param  {Function} done
 */
function serialize (user, done) {
    done(null, user);  
}

/**
 * deserialize user
 * @param  {Object}   obj
 * @param  {Function} done
 */
function deserialize (obj, done) {
  done(null, obj);
}

/**
 * Register authenticationProvider middleware
 */
module.exports = function authenticationProvider (app) {
    passport.serializeUser(serialize);
    passport.deserializeUser(deserialize);

    passport.use(localStrategy);
    //passport.use(googleStrategy);
    //passport.use(facebookStrategy);
    //passport.use(twitterStrategy);
    //passport.use(githubStrategy);

    app.use(passport.initialize());
    app.use(passport.session());
};