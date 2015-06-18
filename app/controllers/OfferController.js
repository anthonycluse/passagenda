var Controller     = require('microscope-web').Controller;
var commonFltrs    = require('../filters/commons');
var securityFltrs  = require('../filters/security');
var csrfFltrs      = require('../filters/csrf');
var OfferDao       = require('../dao/OfferDao');
var OfferTypeDao   = require('../dao/OfferTypeDao');
var OfferCategoryDao   = require('../dao/OfferCategoryDao');
var _              = require('lodash');
var fs             = require('fs');

/**
 * CategoryController class.
 */
module.exports = OfferController = Controller.extend({

  baseUrl: "/offer",

  initialize: function () {
    this.offerDao = new OfferDao();
    this.offerTypeDao = new OfferTypeDao();
    this.offerCategoryDao = new OfferCategoryDao();
  },

  filters: [
    securityFltrs.authorize,
    csrfFltrs.csrf
  ],

  routes: {
    'get /'           : 'index',
    'get /_index'     : { action: '_index', filters:[ csrfFltrs.antiForgeryToken ] },
    'get /show/:id'   : 'show',
    'get /new'        : { filters:[ csrfFltrs.antiForgeryToken ], action: 'new' },
    'post /create'    : 'create',
    'get /edit/:id'   : { filters:[ csrfFltrs.antiForgeryToken ], action: 'edit' },
    'post /update'    : { filters:[ csrfFltrs.antiForgeryToken ], action: 'update' },
    'get /delete/:id' : { filters:[ csrfFltrs.antiForgeryToken ], action: 'delete' },
    'post /destroy'   : 'destroy'
  },

  index: function(request, response) {
    this.offerDao.getAll().success(function (offers) {
      response.render('offer/index', {'offers': offers});
    });
  },

  _index: function(request, response) {
    this.offerDao.getAll().success(function (offers) {
      console.log(offers);
      response.render('offer/_index', {'offers': offers});
    });
  },

  show: function(request, response) {
    var self = this;
    var id = request.params.id;
    this.offerDao.get(id).success(function (offer) {
      if(!offer){
        request.flash('danger', 'Aucune offre avec l\'id : ' + id);
        response.redirect(self.baseUrl+'/_index');
      }else{
        response.render('offer/show', {'offer': offer});
      }
    });
  },

  new: function (request, response) {
    var self = this;
    self.offerTypeDao.getAll().success( function(offerTypes){
      self.offerCategoryDao.getAll().success( function(offercategories){
        response.render('offer/new', {offerTypes: offerTypes, offercategories: offercategories});
      });
    });
  },

  create: function (request, response) {
    var self = this;
    var offer = request.body.offer;
    console.log(offer);
    this.offerDao.save(offer, function(modelError, category){
      if(modelError){
        request.flash('danger', self._parseValidationError(modelError));
        response.redirect('offer/new');
      }else{
        request.flash('success', 'Offre sauvegardée');
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  edit: function (request, response) {
    var id = request.params.id,
        self = this;
    this.offerDao.get(id).success(function (offer) {
      self.offerTypeDao.getAll().success( function(offerTypes){
        response.render('offer/edit', {
          offer: offer,
          offerTypes: offerTypes,
          errors: null
        });
      });
    });
  },

  update: function (request, response) {
    var self = this;
    var properties = request.body.offer;
    this.offerDao.update(properties, function (modelError, offer) {
      if(offer){
        if(modelError){
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/offer/edit/' + properties.id);
        }else{
          request.flash('success', 'Offre mise à jour');
          response.redirect(self.baseUrl+'/_index');
        }
      }else{
        request.flash('danger', 'Aucune offre avec l\'id : ' + properties.id);
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  delete: function (request, response) {
    var id = request.params.id;
    this.offerDao.get(id).success(function (offer) {
      response.render('offer/delete', { 'offer': offer });
    }).error(function (error) {
      request.flash('danger', 'Aucune offre avec l\'id : ' + id);
      response.redirect(self.baseUrl);
    });
  },

  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    self.offerDao.delete(id, function () {
      request.flash('success', 'Offre supprimée');
      response.redirect(self.baseUrl+'/_index');
    });
  },

  _parseValidationError: function (modelError) {
    if(_.isString(modelError)){ return modelError; }

    var errors = [];
    for (var key in modelError) {
      errors.push(modelError[key]);
    }
    return errors.join('<br>');
  }
});
