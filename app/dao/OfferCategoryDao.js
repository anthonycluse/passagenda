var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

var OfferCategoryDao = function () {
  this.context = dbContext.entities;
};

_.extend(OfferCategoryDao.prototype, {

  getAll: function (callback) {
    return this.context.OfferCategory.findAll({include: [{ model: this.context.Offer}]});
  },

  get: function (id, callback) {
    return this.context.OfferCategory.find(id);
  },

  save: function(properties, callback){
    this.context.OfferCategory.create(properties)
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
        category.updateAttributes(properties).success(function (category) {
          callback(null, category);
        }).error(function (error) {
          callback(error, category);
        });
      }else{
        callback('Aucune catégorie avec l\'id :' + properties.id, null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.OfferCategory.find(id).success(function (type) {
      if(type){
        type.destroy().success(callback);
      }
      else{
        callback('Aucune catégorie avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = OfferCategoryDao;
