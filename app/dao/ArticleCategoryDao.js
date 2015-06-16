var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

var ArticleCategoryDao = function () {
  this.context = dbContext.entities;
};

_.extend(ArticleCategoryDao.prototype, {

  getAll: function (callback) {
    return this.context.ArticleCategory.findAll({include: [{ model: this.context.Article}]});
  },

  get: function (id, callback) {
    return this.context.ArticleCategory.find(id);
  },

  save: function(properties, callback){
    this.context.ArticleCategory.create(properties)
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
    this.context.ArticleCategory.find(id).success(function (category) {
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

module.exports = ArticleCategoryDao;
