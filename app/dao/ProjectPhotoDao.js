/**
 * Imports
 */
var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

/**
 * ProjectPhoto dao
 */
var ProjectPhotoDao = function () {
  this.context = dbContext.entities;
};

_.extend(ProjectPhotoDao.prototype, {

  /**
     * getAll ProjectPhotos
     * @param  {Function} callback
     */
  getAll: function (callback) {
    return this.context.ProjectPhoto.findAll();
  },

  getAllByProjectId: function (id, callback) {
    return this.context.ProjectPhoto.findAll({where: {ProjectId: id}});
  }, 

  /**
     * get ProjectPhoto by id
     * @param  {Integer}   id
     * @param  {Function} callback
     */
  get: function (id, callback) {
    return this.context.ProjectPhoto.find(id);
  },

  /**
     * save ProjectPhoto with properties
     * @param  {Object}   properties
     * @param  {Function} callback
     */
  save: function(properties, callback){
    this.context.ProjectPhoto.create(properties)
    .success(function (projectPhoto) {
      callback(null, projectPhoto);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  /**
     * Update projectPhoto from properties
     * @param  {Object}   properties
     * @param  {Function} callback
     */
  update: function (properties, callback) {
    this.get(properties.id).success(function (projectPhoto) {
      if(projectPhoto){
        projectPhoto.updateAttributes(properties).success(function (projectPhoto) {
          callback(null, projectPhoto);
        }).error(function (error) {
          callback(error, projectPhoto);
        });
      }else{
        callback('Aucun média avec l\'id :' + properties.id, null);
      }
    });
  },

  /**
     * Delete projectPhoto from id
     * @param  {Integer}   id
     * @param  {Function} callback
     */
  delete: function (id, callback) {
    this.context.ProjectPhoto.find(id).success(function (projectPhoto) {
      if(projectPhoto){
        projectPhoto.destroy().success(callback);
      }
      else{
        callback('Aucun média avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = ProjectPhotoDao;
