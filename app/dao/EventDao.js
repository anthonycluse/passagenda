var dbContext = require('./../../db/DbContext');
var _ = require('lodash');


var EventDao = function () {
  this.context = dbContext.entities;
};

_.extend(EventDao.prototype, {

  getAll: function (callback) {
    return this.context.Event.findAll({include: [{ model: this.context.EventCategory}]});
  },

  getAllOfDay: function(like, callback){
    return this.context.Event.findAll({where: ['start like ?', like+'%']});
  },

  getFiveLast: function (callback) {
    return this.context.Event.findAll({limit: 5, include: [{ model: this.context.EventCategory}]});
  },

  get: function (id, callback) {
    return this.context.Event.find(id);
  },

  save: function(properties, callback){
    this.context.Event.create(properties)
    .success(function (event) {
      callback(null, event);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  update: function (properties, callback) {
    this.get(properties.id).success(function (event) {
      if(event){
        event.updateAttributes(properties).success(function (event) {
          callback(null, event);
        }).error(function (error) {
          callback(error, event);
        });
      }else{
        callback('Aucun événement avec l\'id :' + properties.id, null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.Event.find(id).success(function (event) {
      if(event){
        event.destroy().success(callback);
      }
      else{
        callback('Aucun événement avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = EventDao;
