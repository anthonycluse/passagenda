var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

var OfferTypeDao = function () {
  this.context = dbContext.entities;
};

_.extend(OfferTypeDao.prototype, {

  getAll: function (callback) {
    return this.context.OfferType.findAll({include: [{ model: this.context.Offer}]});
  },

  get: function (id, callback) {
    return this.context.OfferType.find(id);
  },

  save: function(properties, callback){
    this.context.OfferType.create(properties)
    .success(function (type) {
      callback(null, type);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  update: function (properties, callback) {
    this.get(properties.id).success(function (category) {
      if(category){
        category.updateAttributes(properties).success(function (type) {
          callback(null, type);
        }).error(function (error) {
          callback(error, category);
        });
      }else{
        callback('Aucun type avec l\'id :' + properties.id, null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.OfferType.find(id).success(function (type) {
      if(type){
        type.destroy().success(callback);
      }
      else{
        callback('Aucun type avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = OfferTypeDao;
