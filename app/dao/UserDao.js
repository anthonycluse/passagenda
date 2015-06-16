/**
 * Imports
 */
var dbContext = require('./../../db/DbContext');
var bcrypt    = require('bcrypt-nodejs');
var _         = require('lodash');

/**
 * Article dao
 */
var UserDao = function () {
  this.context = dbContext.entities;
};

_.extend(UserDao.prototype, {

  save: function (properties, callback) {
    var self = this;

    encryptPassword(properties.password, function (encryptedPassWord) {
      properties.password = encryptedPassWord;
      self.context.User.create(properties).success(function (user) {
        callback(null, user);
      }).error(function (error) {
        callback(error, null);
      });
    });
  },

  get: function (id) {
    return this.context.User.find(id);
  },

  getAllAdmin: function(){
      return this.context.User.findAll({where: {right: 1}});
  },

  getByUsername: function (username) {
    return this.context.User.find({ where: { username: username} });
  },

  getAllByRight: function(right){
    return this.context.User.findAll({ where: { right: right} });
  },

  getExternalUser: function (openId, provider) {
    return this.context.User.find({ where: { openId: openId, provider: provider} });
  },

  updateProfil: function(id, properties, callback){
    this.get(id).success( function(user){
      if( user ){
        user.firstname = properties.firstname;
        user.lastname = properties.lastname;
        user.address = properties.address;
        user.postal_code = properties.postal_code;
        user.city = properties.city;
        user.save().success( function(user){
          callback(null, user);
        }).error( function(error){
          callback(error, null);
        });
      }else{
        callback('Aucun utilisateur avec cet id.', null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.User.find(id).success(function (user) {
      if(user){
        user.destroy().success(callback);
      }
      else{
        callback('Aucun utilisateur avec l\'id :' + id);
      }
    })
    .error(callback);
  },

  updatePassword: function (id, oldPassword, newPassword, callback) {
    this.get(id).success(function (user) {
      if(user){
        comparePassword(oldPassword, user.password, function (result) {
          if(result){
            encryptPassword(newPassword, function (encryptedPassWord) {
              user.password = encryptedPassWord;
              user.save().success(function (user) {
                callback(null, user);
              }).error(function (error) {
                callback(error, null);
              });
            });
          }else{
            callback('Mot de passe incorrecte.', null);
          }
        });

      }else{
        callback('Aucun utilisateur avec cet id.', null);
      }
    });
  }
});

/**
 * encrypted password
 * @param  {String}   password
 * @param  {Function} callback
 */
var encryptPassword = function (password, callback){
  bcrypt.genSalt(10, function(err, salt) {
    if (err) console.log('error during encryption');
    bcrypt.hash(password, salt, null, function(err, cryptedPassWord) {
      if(err){ throw err; }
      else{
        callback(cryptedPassWord);
      }
    });
  });
}

/**
 * compare password and return callback if valid
 * @param  {String}   password
 * @param  {String}   encryptedPassWord
 * @param  {Function} callback
 */
var comparePassword = function (password, encryptedPassWord, callback){
  bcrypt.compare(password, encryptedPassWord, function(err, result){
    if(err){throw err;}
    return callback(result);
  });
}

module.exports = UserDao;
