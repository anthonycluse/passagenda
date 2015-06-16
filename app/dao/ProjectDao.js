/**
 * Imports
 */
var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

/**
 * Project dao
 */
var ProjectDao = function () {
  this.context = dbContext.entities;
};

_.extend(ProjectDao.prototype, {

  /**
     * getAll projects
     * @param  {Function} callback
     */
  getAll: function (callback) {
    return this.context.Project.findAll({order: 'id desc', include: [{ model: this.context.ProjectCategory, as: 'ProjectCategory' }, {model: this.context.ProjectPhoto}]});
  },
  getAllOnline: function (callback) {
    return this.context.Project.findAll({order: 'id desc', where: {state: 1}, include: [{ model: this.context.ProjectCategory, as: 'ProjectCategory' }, {model: this.context.ProjectPhoto}]});
  },

  /**
     * get project by id
     * @param  {Integer}   id
     * @param  {Function} callback
     */
  get: function (id, callback) {
    return this.context.Project.find({where: {id: id}, include: [{ model: this.context.ProjectCategory}, {model: this.context.ProjectPhoto}]});
  },

  /**
     * save project with properties
     * @param  {Object}   properties
     * @param  {Function} callback
     */
  save: function(properties, callback){
    this.context.Project.create(properties)
    .success(function (project) {
      callback(null, project);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  /**
     * Update project from properties
     * @param  {Object}   properties
     * @param  {Function} callback
     */
  update: function (properties, callback) {
    this.get(properties.id).success(function (project) {
      if(project){
        project.updateAttributes(properties).success(function (project) {
          callback(null, project);
        }).error(function (error) {
          callback(error, project);
        });
      }else{
        callback('Aucun projet avec l\'id :' + properties.id, null);
      }
    });
  },

  /**
     * Delete project from id
     * @param  {Integer}   id
     * @param  {Function} callback
     */
  delete: function (id, callback) {
    this.context.Project.find(id).success(function (project) {
      if(project){
        project.destroy().success(callback);
      }
      else{
        callback('Aucun projet avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = ProjectDao;
