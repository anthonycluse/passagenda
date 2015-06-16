/**
 * Imports
 */
var socialsConfigs = require('../../configs/socials.json');
var passport       = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var UserDao        = require('../../app/dao/UserDao');

var userDao = new UserDao();

/**
 * signup google user
 * @param  {[type]}   identifier
 * @param  {[type]}   profile
 * @param  {Function} done
 */
function signupGoogleUser(identifier, profile, done) {
	var provider = 'google';

	var user = {
		username: profile.displayName,
		email: profile.emails[0].value,
		provider: provider,
		openId: identifier
	};

	userDao.getExternalUser(identifier, provider).success(function (findedUser) {
		if(findedUser){
			done(null, findedUser);
		}else{
			userDao.save(user, function (error, user) {
				if(error){
					done(error, null);
				}else{
					done(null, user);
				}
			});
		}
	});
}

/**
 * Google authentication strategy
 */
module.exports = new GoogleStrategy(socialsConfigs.google, signupGoogleUser);