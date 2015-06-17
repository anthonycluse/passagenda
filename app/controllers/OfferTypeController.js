/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var commonFltrs   = require('../filters/commons');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var OfferTypeDao  = require('../dao/OfferTypeDao');
var _             = require('lodash');
var fs            = require('fs');

/**
 * CategoryController class.
 */
module.exports = OfferTypeController = Controller.extend({

  baseUrl: "/offertype",

  initialize: function () {
    this.offerTypeDao = new OfferTypeDao();
  },

  filters: [
    securityFltrs.authorize,
    csrfFltrs.csrf
  ],

  routes: {
    'get /'           : 'index',
    'get /_index'     : '_index',
    'get /show/:id'   : 'show',
    'get /new'        : { filters:[ csrfFltrs.antiForgeryToken ], action: 'new' },
    'post /create'    : 'create',
    'get /edit/:id'   : { filters:[ csrfFltrs.antiForgeryToken ], action: 'edit' },
    'post /update'    : { filters:[ csrfFltrs.antiForgeryToken ], action: 'update' },
    'get /delete/:id' : { filters:[ csrfFltrs.antiForgeryToken ], action: 'delete' },
    'post /destroy'   : 'destroy'
  },

  index: function(request, response) {
    this.offerTypeDao.getAll().success(function (offertypes) {
      response.render('offerType/index', {'offertypes': offertypes});
    });
  },

  _index: function(request, response) {
    this.offerTypeDao.getAll().success(function (offertypes) {
      response.render('offerType/_index', {'offertypes': offertypes});
    });
  },

  show: function(request, response) {
    var self = this;
    var id = request.params.id;
    this.offerTypeDao.get(id).success(function (offertype) {
      if(!offertype){
        request.flash('danger', 'Aucun type d\'offre avec l\'id : ' + id);
        response.redirect(self.baseUrl+'/_index');
      }else{
        response.render('offerType/show', {'offertype': offertype});
      }
    });
  },

  new: function (request, response) {
    response.render('offerType/new');
  },

  create: function (request, response) {
    var self = this;
    var offertype = request.body.offertype;
    this.offerTypeDao.save(offertype, function(modelError, offertype){
      if(modelError){
        request.flash('danger', self._parseValidationError(modelError));
        response.redirect('/offertype/new');
      }else{
        request.flash('success', 'Type d\'offre sauvegardée');
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  edit: function (request, response) {
    var id = request.params.id;
    this.offerTypeDao.get(id).success(function (offertype) {
      response.render('offerType/edit', {'offertype': offertype, 'errors': null });
    });
  },

  update: function (request, response) {
    var self = this;
    var properties = request.body.offertype;
    this.offerTypeDao.update(properties, function (modelError, offertype) {
      if(offertype){
        if(modelError){
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/offertype/edit/' + properties.id);
        }else{
          request.flash('success', 'Type d\'offre mis à jour');
          response.redirect(self.baseUrl+'/_index');
        }
      }else{
        request.flash('danger', 'Aucun type d\'offre avec l\'id : ' + properties.id);
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  delete: function (request, response) {
    var id = request.params.id;
    this.offerTypeDao.get(id).success(function (offertype) {
      response.render('offerType/delete', { 'offertype': offertype });
    }).error(function (error) {
      request.flash('danger', 'Aucun type d\'offre avec l\'id : ' + id);
      response.redirect(self.baseUrl);
    });
  },

  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    self.offerTypeDao.delete(id, function () {
      request.flash('success', 'Type d\'offre supprimée');
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
