var Controller        = require('microscope-web').Controller;
var commonFltrs       = require('../filters/commons');
var securityFltrs     = require('../filters/security');
var csrfFltrs         = require('../filters/csrf');
var OfferStoreDao     = require('../dao/OfferStoreDao');
var _                 = require('lodash');
var fs                = require('fs');

module.exports = OfferStoreController = Controller.extend({

  baseUrl: "/offerstore",

  initialize: function () {
    this.offerStoreDao = new OfferStoreDao();
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
    this.offerStoreDao.getAll().success(function (offerstores) {
      response.render('offerStore/index', {'offerstores': offerstores});
    });
  },

  _index: function(request, response) {
    this.offerStoreDao.getAll().success(function (offerstores) {
      response.render('offerStore/_index', {'offerstores': offerstores});
    });
  },

  show: function(request, response) {
    var self = this;
    var id = request.params.id;
    this.offerStoreDao.get(id).success(function (offerstore) {
      if(!offerstore){
        request.flash('danger', 'Aucune boutique avec l\'id : ' + id);
        response.redirect(self.baseUrl+'/_index');
      }else{
        response.render('offerStore/show', {'offerstore': offerstore});
      }
    });
  },

  new: function (request, response) {
    response.render('offerStore/new');
  },

  create: function (request, response) {
    var self = this;
    var offerstore = request.body.offerstore;
    this.offerStoreDao.save(offerstore, function(modelError, offerstore){
      if(modelError){
        request.flash('danger', self._parseValidationError(modelError));
        response.redirect('/offerstore/new');
      }else{
        request.flash('success', 'Boutique sauvegardée');
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  edit: function (request, response) {
    var id = request.params.id;
    this.offerStoreDao.get(id).success(function (offerstore) {
      response.render('offerStore/edit', {'offerstore': offerstore, 'errors': null });
    });
  },

  update: function (request, response) {
    var self = this;
    var properties = request.body.offerstore;
    this.offerStoreDao.update(properties, function (modelError, offerstore) {
      if(offerstore){
        if(modelError){
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/offerstore/edit/' + properties.id);
        }else{
          request.flash('success', 'Boutique mise à jour');
          response.redirect(self.baseUrl+'/_index');
        }
      }else{
        request.flash('danger', 'Aucune boutique avec l\'id : ' + properties.id);
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  delete: function (request, response) {
    var id = request.params.id;
    this.offerStoreDao.get(id).success(function (offerstore) {
      response.render('offerStore/delete', { 'offerstore': offerstore });
    }).error(function (error) {
      request.flash('danger', 'Aucune boutique avec l\'id : ' + id);
      response.redirect(self.baseUrl);
    });
  },

  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    self.offerStoreDao.delete(id, function () {
      request.flash('success', 'Boutique supprimée');
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
