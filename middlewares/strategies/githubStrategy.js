/**
 * Imports
 */
var socialsConfigs  = require('../../configs/socials.json');
var passport        = require('passport');
var GithubStrategy = require('passport-github').Strategy;
var UserDao         = require('../../app/dao/UserDao');

var userDao = new UserDao();

/**
 * signIn Twitter User
 * @param  {[type]}   token
 * @param  {[type]}   tokenSecret
 * @param  {[type]}   profile
 * @param  {Function} done
 */
function signInGithubUser (accessToken, refreshToken, profile, done) {
	var provider = 'github';

	var user = {
		username: profile.username,
		email: profile.username+'@github.com',
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
module.exports = new GithubStrategy(socialsConfigs.github, signInGithubUser);