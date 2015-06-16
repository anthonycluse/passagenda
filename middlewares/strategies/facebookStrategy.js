/**
 * Imports
 */
var socialsConfigs   = require('../../configs/socials.json');
var passport         = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
var UserDao          = require('../../app/dao/UserDao');
var _                = require('lodash');

var userDao          = new UserDao();

/**
 * signup facebook user
 * @param  {[type]}   accessToken
 * @param  {[type]}   refreshToken
 * @param  {[type]}   profile
 * @param  {Function} done
 */
function signupFacebookUser(accessToken, refreshToken, profile, done) {
	var provider = 'facebook';

	var userDto = {
		username: profile.displayName,
		email: profile.name.givenName + profile.name.familyName + '@facebook.com',
		provider: provider,
		openId: profile.id
	};

	userDao.getExternalUser(profile.id, provider).success(function (findedUser) {
		if(findedUser){
			done(null, findedUser);
		}else{
			userDao.save(userDto, function (error, user) {
				if(error){
					done(_parseValidationError(error), null);
				}else{
					done(null, user);
				}
			});
		}
	});
}

function _parseValidationError (modelError) {
    if(_.isString(modelError)){ return modelError; }

    var errors = [];
    for (var key in modelError) {
        errors.push(modelError[key]);
    }
    return errors.join('<br>');
}

/**
 * Facebook Authentication Strategy
 */
module.exports = new FacebookStrategy(socialsConfigs.facebook, signupFacebookUser);