/**
 * Imports.
 */
var Controller          = require('microscope-web').Controller;
var OfferDao            = require('../dao/OfferDao');
var StoreAddressDao     = require('../dao/StoreAddressDao');
var StorePhotoDao       = require('../dao/StorePhotoDao');
var securityFltrs       = require('../filters/security');
var moment              = require('moment');
var async               = require('async');

/**
 * ArticleController class.
 */
module.exports = Controller.extend({

  baseUrl: "/api/offer",

  initialize: function () {
    this.offerDao = new OfferDao();
    this.storeAddressDao = new StoreAddressDao();
    this.storePhotoDao = new StorePhotoDao();
  },

  filters:[
    //securityFltrs.authorize
  ],

  routes: {
    'get /'       : 'getAll',
    'get /:id'    : 'get',
    'post /'      : 'post',
    'put /'       : 'put',
    'delete /:id' : 'delete',
    'get /state/:state' : 'getAll'
  },

  getAll: function(request, response) {
    /*this.offerDao.getAll().success(function (offers) {
      response.json(offers);
    });*/
    var self = this;
    this.offerDao.getAll().success(function (offers) {
      async.map(offers, function(offer, callback){
        self.storeAddressDao.getAllByStore(offer.OfferStore.id).success( function(addresses){
          self.storePhotoDao.getAllByStore(offer.OfferStore.id).success( function(photos){
            offer.OfferStore.dataValues.addresses = addresses;
            offer.OfferStore.dataValues.photos = photos;
            callback(null, offer);
          });
        });
      }, function(err, transformed){
        console.log(transformed);
        response.json(transformed);
      });
    });
  },

  get: function (request, response) {
    var offerId = request.params.id;
    this.offerDao.get(offerId).success(function (offer) {
      if(offer){
        response.json(offer);
      }else{
        response.send("Pas d'offre avec l'id : " + offerId);
      }
    });
  },

  post: function (request, response) {
    var self = this;
    var offer = request.body;
    this.offerDao.save(offer, function(modelError, offer){
      if(modelError){
        response.json(modelError);
      }else{
        response.json(offer);
      }
    });
  },

  put: function (request, response) {
    var properties = request.body;
    this.offerDao.update(properties, function (modelError, offer) {
      if(offer){
        if(modelError){
          response.json(modelError);
        }else{
          response.json(offer);
        }
      }else{
        response.send(404);
      }
    });
  },

  delete: function (request, response) {
    var id = request.params.id;
    this.offerDao.delete(id, function (error) {
      if(error){
        response.json(404);
      }else{
        response.json('Offre supprimer !');
      }
    });
  }
});
