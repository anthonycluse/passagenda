/**
 * Imports
 */
var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

var FileDao = function () {
  this.context = dbContext.entities;
};

_.extend(FileDao.prototype, {

  getAll: function (callback) {
    return this.context.File.findAll();
  },

  get: function (id, callback) {
    return this.context.File.find(id);
  },

  save: function(properties, callback){
    this.context.File.create(properties)
    .success(function (file) {
      callback(null, file);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  update: function (properties, callback) {
    this.get(properties.id).success(function (file) {
      if(file){
        file.updateAttributes(properties).success(function (file) {
          callback(null, file);
        }).error(function (error) {
          callback(error, file);
        });
      }else{
        callback('Aucun fichierfile avec l\'id :' + properties.id, null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.File.find(id).success(function (file) {
      if(file){
        file.destroy().success(callback);
      }
      else{
        callback('Aucun fichier avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = FileDao;
