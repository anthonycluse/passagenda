/**
 * Imports.
 */
var Controller          = require('microscope-web').Controller;
var UserDao             = require('../dao/UserDao');
var securityFltrs       = require('../filters/security');
var moment              = require('moment');
var async               = require('async');
var passport            = require('passport');

/**
 * ArticleController class.
 */
module.exports = Controller.extend({

  baseUrl: "/api/user",

  initialize: function () {
    this.userDao = new UserDao();
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
    'get /state/:state' : 'getAll',
    'post /logon' : { action: 'logon', filters:[passport.authenticate('local', { failureRedirect: '/user/signin'})]}
  },

  logon: function(request, response) {
    response.json(request.user.dataValues);
  },

  getAll: function(request, response) {
    /*this.userDao.getAll().success(function (offers) {
      response.json(offers);
    });*/
    var self = this;
    this.userDao.getAll().success(function (offers) {
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
    this.userDao.get(offerId).success(function (offer) {
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
    this.userDao.save(offer, function(modelError, offer){
      if(modelError){
        response.json(modelError);
      }else{
        response.json(offer);
      }
    });
  },

  put: function (request, response) {
    var properties = request.body;
    this.userDao.update(properties, function (modelError, offer) {
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
    this.userDao.delete(id, function (error) {
      if(error){
        response.json(404);
      }else{
        response.json('Offre supprimer !');
      }
    });
  }
});
