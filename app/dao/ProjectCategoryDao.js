var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

var ProjectCategoryDao = function () {
  this.context = dbContext.entities;
};

_.extend(ProjectCategoryDao.prototype, {

  getAll: function (callback) {
    return this.context.ProjectCategory.findAll({include: [{ model: this.context.Project}]});
  },

  get: function (id, callback) {
    return this.context.ProjectCategory.find(id);
  },

  save: function(properties, callback){
    this.context.ProjectCategory.create(properties)
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
    this.context.ProjectCategory.find(id).success(function (category) {
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

module.exports = ProjectCategoryDao;
