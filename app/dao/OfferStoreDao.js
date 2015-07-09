var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

var OfferStoreDao = function () {
  this.context = dbContext.entities;
};

_.extend(OfferStoreDao.prototype, {

  getAll: function (callback) {
    return this.context.OfferStore.findAll({include: [{model: this.context.Offer}]});
  },

  get: function (id, callback) {
    return this.context.OfferStore.find(id);
  },

  getLastTen: function(){
    return this.context.OfferStore.findAll({limit: 10, order: 'id desc'});
  },

  save: function(properties, callback){
    this.context.OfferStore.create(properties)
    .success(function (store) {
      callback(null, store);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  update: function (properties, callback) {
    this.get(properties.id).success(function (store) {
      if(store){
        store.updateAttributes(properties).success(function (store) {
          callback(null, store);
        }).error(function (error) {
          callback(error, store);
        });
      }else{
        callback('Aucune boutique avec l\'id :' + properties.id, null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.OfferStore.find(id).success(function (store) {
      if(store){
        store.destroy().success(callback);
      }
      else{
        callback('Aucune boutique avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = OfferStoreDao;
