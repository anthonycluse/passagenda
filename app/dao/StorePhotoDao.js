var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

var StorePhotoDao = function () {
  this.context = dbContext.entities;
};

_.extend(StorePhotoDao.prototype, {

  getAll: function (callback) {
    return this.context.StorePhoto.findAll();
  },

  getAllByStore: function (id, callback) {
    return this.context.StorePhoto.findAll({where: {OfferStoreId: id}});
  },

  get: function (id, callback) {
    return this.context.StorePhoto.find(id);
  },

  save: function(properties, callback){
    this.context.StorePhoto.create(properties)
    .success(function (storePhoto) {
      callback(null, storePhoto);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  update: function (properties, callback) {
    this.get(properties.id).success(function (storePhoto) {
      if(storePhoto){
        storePhoto.updateAttributes(properties).success(function (storePhoto) {
          callback(null, storePhoto);
        }).error(function (error) {
          callback(error, storePhoto);
        });
      }else{
        callback('Aucun média avec l\'id :' + properties.id, null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.StorePhoto.find(id).success(function (storePhoto) {
      if(storePhoto){
        storePhoto.destroy().success(callback);
      }
      else{
        callback('Aucun média avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = StorePhotoDao;
