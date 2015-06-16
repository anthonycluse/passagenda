var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

var EcCayegoryDao = function () {
  this.context = dbContext.entities;
};

_.extend(EcCayegoryDao.prototype, {

  getAll: function (callback) {
    return this.context.EcCategory.findAll({include: [{model: this.context.EcCategory}, {model: this.context.EcProduct}]});
  },

  get: function (id, callback) {
    return this.context.EcCategory.find(id);
  },

  save: function(properties, callback){
    this.context.EcCategory.create(properties)
    .success(function (category) {
      callback(null, category);
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
    this.context.EcCategory.find(id).success(function (category) {
      if(category){
        category.destroy().success(callback);
      }
      else{
        callback('Aucune catégorie avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = EcCayegoryDao;
