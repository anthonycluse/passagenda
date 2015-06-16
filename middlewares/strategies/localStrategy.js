// Imports
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserDao       = require('../../app/dao/UserDao');
var bcrypt        = require('bcrypt-nodejs');

var userDao = new UserDao();

var config = {
    usernameField: 'username',
    passwordField: 'password'
};

/**
 * signin local user
 * @param  {[type]}   username
 * @param  {[type]}   password
 * @param  {Function} callback
 */
function signinLocalUser (username, password, callback) {
    userDao.getByUsername(username).success(function (user) {
        if(user){
            bcrypt.compare(password, user.password, function(err, result){
                if(result){
                    callback(null, user);
                }
                else{
                    console.log('Incorrect password.');
                    callback(null, false, { message: 'Incorrect password.' });
                }
            });
        }
        else {
            console.log('Incorrect username');
            callback(null, false, { message: 'Incorrect username' });
        }
    });
}

// Local authentication strategy
module.exports = new LocalStrategy(config, signinLocalUser);