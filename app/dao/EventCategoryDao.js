var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

var EventCategoryDao = function () {
  this.context = dbContext.entities;
};

_.extend(EventCategoryDao.prototype, {

  getAll: function (callback) {
    return this.context.EventCategory.findAll({include: [{ model: this.context.Event}]});
  },

  get: function (id, callback) {
    return this.context.EventCategory.find(id);
  },

  save: function(properties, callback){
    this.context.EventCategory.create(properties)
    .success(function (eventCategory) {
      callback(null, eventCategory);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  update: function (properties, callback) {
    this.get(properties.id).success(function (eventCategory) {
      if(eventCategory){
        eventCategory.updateAttributes(properties).success(function (eventCategory) {
          callback(null, eventCategory);
        }).error(function (error) {
          callback(error, eventCategory);
        });
      }else{
        callback('Aucune catégorie avec l\'id :' + properties.id, null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.EventCategory.find(id).success(function (eventCategory) {
      if(eventCategory){
        eventCategory.destroy().success(callback);
      }
      else{
        callback('Aucune catégorie avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = EventCategoryDao;
