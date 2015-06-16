var dbContext = require('./../../db/DbContext');
var _ = require('lodash');


var LinkDao = function () {
  this.context = dbContext.entities;
};

_.extend(LinkDao.prototype, {


  getAll: function (callback) {
    return this.context.Link.findAll({include: [{ model: this.context.Link}], where: {type: [0,1,2]}});
  },

  getAllByOrder: function (callback) {
    return this.context.Link.findAll({order: 'position ASC', include: [{ model: this.context.Link}], where: {type: [0,1]}});
  },

  get: function (id, callback) {
    return this.context.Link.find(id);
  },

  getHome: function(){
    return this.context.Link.findAll({where: {type: 0}});
  },

  save: function(properties, callback){
    this.context.Link.create(properties)
    .success(function (media) {
      callback(null, media);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  update: function (properties, callback) {
    this.get(properties.id).success(function (link) {
      if(link){
        link.updateAttributes(properties).success(function (link) {
          callback(null, link);
        }).error(function (error) {
          callback(error, link);
        });
      }else{
        callback('Aucun lien avec l\'id :' + properties.id, null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.Link.find(id).success(function (link) {
      if(link){
        link.destroy().success(callback);
      }
      else{
        callback('Aucun lien avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = LinkDao;
