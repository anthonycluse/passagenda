/**
 * Imports
 */
var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

/**
 * Article dao
 */
var PageDao = function () {
  this.context = dbContext.entities;
};

_.extend(PageDao.prototype, {

  /**
     * getAll articles
     * @param  {Function} callback
     */
  getAll: function (callback) {
    return this.context.Page.findAll();
  },

  /**
     * getAll online articles
     * @param  {Function} callback
     */
  getAllOnline: function (callback) {
    return this.context.Page.findAll({where: {state: 1}});
  },

  /**
     * getAll offline articles
     * @param  {Function} callback
     */
  getAllOffline: function (callback) {
    return this.context.Page.findAll({where: {state: 0}});
  },

  /**
     * get article by id
     * @param  {Integer}   id
     * @param  {Function} callback
     */
  get: function (id, callback) {
    return this.context.Page.find(id);
  },

  /**
     * save article with properties
     * @param  {Object}   properties
     * @param  {Function} callback
     */
  save: function(properties, callback){
    this.context.Page.create(properties)
    .success(function (article) {
      callback(null, article);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  /**
     * Update article from properties
     * @param  {Object}   properties
     * @param  {Function} callback
     */
  update: function (properties, callback) {
    this.get(properties.id).success(function (page) {
      if(page){
        page.updateAttributes(properties).success(function (page) {
          callback(null, page);
        }).error(function (error) {
          callback(error, page);
        });
      }else{
        callback('Aucune page avec l\'id :' + properties.id, null);
      }
    });
  },

  /**
     * Delete article from id
     * @param  {Integer}   id
     * @param  {Function} callback
     */
  delete: function (id, callback) {
    this.context.Page.find(id).success(function (page) {
      if(page){
        page.destroy().success(callback);
      }
      else{
        callback('Aucune page avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = PageDao;
