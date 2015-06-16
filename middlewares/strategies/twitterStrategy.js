/**
 * Imports
 */
var socialsConfigs  = require('../../configs/socials.json');
var passport        = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var UserDao         = require('../../app/dao/UserDao');

var userDao = new UserDao();

/**
 * signIn Twitter User
 * @param  {[type]}   token
 * @param  {[type]}   tokenSecret
 * @param  {[type]}   profile
 * @param  {Function} done
 */
function signInTwitterUser (token, tokenSecret, profile, done) {
	var provider = 'twitter';

	var user = {
		username: profile.username,
		email: profile.username+'@twitter.com',
		provider: provider,
		openId: profile.id
	};

	userDao.getExternalUser(profile.id, provider).success(function (findedUser) {
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

// Twitter authentication strategy
module.exports = new TwitterStrategy(socialsConfigs.twitter, signInTwitterUser)