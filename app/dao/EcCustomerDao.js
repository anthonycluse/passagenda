/**
 * Imports
 */
var dbContext = require('./../../db/DbContext');
var bcrypt    = require('bcrypt-nodejs');
var _         = require('lodash');

/**
 * Article dao
 */
var EcCustomerDao = function () {
  this.context = dbContext.entities;
};

_.extend(EcCustomerDao.prototype, {

  save: function (properties, callback) {
    var self = this;
    encryptPassword(properties.password, function (encryptedPassWord) {
      properties.password = encryptedPassWord;
      self.context.EcCustomer.create(properties).success(function (customer) {
        callback(null, customer);
      }).error(function (error) {
        callback(error, null);
      });
    });
  },

  get: function (id) {
    return this.context.EcCustomer.find(id);
  },

  getAll: function(){
    return this.context.EcCustomer.findAll({order: 'id desc'});
  },

  getAllByPage: function(offset, limit, callback){
    return this.context.EcCustomer.findAll({offset: offset, limit: limit, order: 'id desc'});
  },

  getLastTen: function(){
    return this.context.EcCustomer.findAll({limit: 10, order: 'id desc'});
  },

  getAllSearch: function (search) {
    return this.context.EcCustomer.findAll({where: ['firstname like ? or lastname like ? or email like ?', '%'+search+'%', '%'+search+'%', '%'+search+'%', '%'+search+'%'], order: 'id desc'});
  },

  getAllSearchByPage: function(search, offset, limit, callback){
    return this.context.EcCustomer.findAll({where: ['firstname like ? or lastname like ? or email like ?', '%'+search+'%', '%'+search+'%', '%'+search+'%', '%'+search+'%'], offset: offset, limit: limit, order: 'id desc'});
  },

  getByEmail: function (email) {
    return this.context.EcCustomer.find({ where: { email: email} });
  },

  getExternalUser: function (openId, provider) {
    return this.context.EcCustomer.find({ where: { openId: openId, provider: provider} });
  },

  update: function(id, properties, callback){
    this.get(id).success( function(customer){
      if( customer ){
        customer.firstname = properties.firstname;
        customer.lastname = properties.lastname;
        customer.email = properties.email;
        customer.address = properties.address;
        customer.complementary_address = properties.complementary_address;
        customer.postal_code = properties.postal_code;
        customer.city = properties.city;
        customer.country = properties.country;
        customer.save().success( function(customer){
          callback(null, customer);
        }).error( function(error){
          callback(error, null);
        });
      }else{
        callback('Aucun client avec cet id.', null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.EcCustomer.find(id).success(function (customer) {
      if(customer){
        customer.destroy().success(callback);
      }
      else{
        callback('Aucun client avec l\'id :' + id);
      }
    })
    .error(callback);
  },

  updatePassword: function (id, oldPassword, newPassword, callback) {
    this.get(id).success(function (customer) {
      if(customer){
        comparePassword(oldPassword, customer.password, function (result) {
          if(result){
            encryptPassword(newPassword, function (encryptedPassWord) {
              customer.password = encryptedPassWord;
              customer.save().success(function (customer) {
                callback(null, customer);
              }).error(function (error) {
                callback(error, null);
              });
            });
          }else{
            callback('Mot de passe incorrecte.', null);
          }
        });

      }else{
        callback('Aucun client avec cet id.', null);
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

module.exports = EcCustomerDao;