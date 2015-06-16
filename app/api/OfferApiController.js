/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var OfferDao    = require('../dao/OfferDao');
var securityFltrs = require('../filters/security');
var moment = require('moment');
var async = require('async');

/**
 * ArticleController class.
 */
module.exports = Controller.extend({

  baseUrl: "/api/offer",

  initialize: function () {
    this.offerDao = new OfferDao();
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

  /**
     * GET /api/article
     * Return all articles
     */
  getAll: function(request, response) {
    this.offerDao.getAll().success(function (offers) {
      response.json(offers);
    });
  },

  /**
     * GET /api/article/:id
     * Return article by id
     */
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

  /**
     * POST /api/article/
     * Add article
     */
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

  /**
     * PUT /api/article/
     * Update article
     */
  put: function (request, response) {
    var properties = request.body;
    this.offerDao.update(properties, function (modelError, offer) {
      if(offer){ // article found
        if(modelError){ // but properties validation error
          response.json(modelError);
        }else{
          response.json(offer);
        }
      }else{
        response.send(404);
      }
    });
  },

  /**
     * DELETE /api/article/:id
     * Delete article by id
     */
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
