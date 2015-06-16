/**
 * Imports
 */
var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

/**
 * Media dao
 */
var MediaDao = function () {
  this.context = dbContext.entities;
};

_.extend(MediaDao.prototype, {

  /**
     * getAll medias
     * @param  {Function} callback
     */
  getAll: function (callback) {
    return this.context.Media.findAll();
  },

  /**
     * get media by id
     * @param  {Integer}   id
     * @param  {Function} callback
     */
  get: function (id, callback) {
    return this.context.Media.find(id);
  },

  /**
     * save media with properties
     * @param  {Object}   properties
     * @param  {Function} callback
     */
  save: function(properties, callback){
    this.context.Media.create(properties)
    .success(function (media) {
      callback(null, media);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  /**
     * Update media from properties
     * @param  {Object}   properties
     * @param  {Function} callback
     */
  update: function (properties, callback) {
    this.get(properties.id).success(function (media) {
      if(media){
        media.updateAttributes(properties).success(function (media) {
          callback(null, media);
        }).error(function (error) {
          callback(error, media);
        });
      }else{
        callback('Aucun média avec l\'id :' + properties.id, null);
      }
    });
  },

  /**
     * Delete media from id
     * @param  {Integer}   id
     * @param  {Function} callback
     */
  delete: function (id, callback) {
    this.context.Media.find(id).success(function (media) {
      if(media){
        media.destroy().success(callback);
      }
      else{
        callback('Aucun média avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = MediaDao;
