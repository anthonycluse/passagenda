var dbContext   = require('./../../db/DbContext');
var _           = require('lodash');

var OfferDao = function () {
  this.context = dbContext.entities;
};

_.extend(OfferDao.prototype, {

  getAll: function (callback) {
    return this.context.Offer.findAll({order: 'id desc', include: [{model: this.context.OfferType}, {model: this.context.OfferCategory}]});
  },

  get: function (id, callback) {
    return this.context.Offer.find({where: {id: id}, include: [{ model: this.context.OfferType}, {model: this.context.OfferCategory}]});
  },

  getLastTen: function(){
    return this.context.Offer.findAll({limit: 10, order: 'id desc'});
  },

  save: function(properties, callback){
    this.context.Offer.create(properties)
    .success(function (offer) {
      callback(null, offer);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  update: function (properties, callback) {
    this.get(properties.id).success(function (offer) {
      if(offer){
        offer.updateAttributes(properties).success(function (article) {
          callback(null, article);
        }).error(function (error) {
          callback(error, offer);
        });
      }else{
        callback('Aucune offre avec l\'id :' + properties.id, null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.Offer.find(id).success(function (offer) {
      if(offer){
        offer.destroy().success(callback);
      }
      else{
        callback('Aucune offre avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = OfferDao;
