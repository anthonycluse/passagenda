var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

var StoreAddressDao = function () {
  this.context = dbContext.entities;
};

_.extend(StoreAddressDao.prototype, {

  getAll: function (callback) {
    return this.context.StoreAddress.findAll();
  },

  getAllByStore: function (id, callback) {
    return this.context.StoreAddress.findAll({where: {OfferStoreId: id}});
  },

  get: function (id, callback) {
    return this.context.StoreAddress.find(id);
  },

  save: function(properties, callback){
    this.context.StoreAddress.create(properties)
    .success(function (storeAddress) {
      callback(null, storeAddress);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  update: function (properties, callback) {
    this.get(properties.id).success(function (storeAddress) {
      if(storeAddress){
        storeAddress.updateAttributes(properties).success(function (storeAddress) {
          callback(null, storeAddress);
        }).error(function (error) {
          callback(error, storeAddress);
        });
      }else{
        callback('Aucune adresse avec l\'id :' + properties.id, null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.StoreAddress.find(id).success(function (storeAddress) {
      if(storeAddress){
        storeAddress.destroy().success(callback);
      }
      else{
        callback('Aucune adresse avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = StoreAddressDao;
