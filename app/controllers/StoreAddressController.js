/**
 * Imports.
 */
var Controller       = require('microscope-web').Controller;
var commonFltrs      = require('../filters/commons');
var securityFltrs    = require('../filters/security');
var csrfFltrs        = require('../filters/csrf');
var StoreAddressDao  = require('../dao/StoreAddressDao');
var _                = require('lodash');
var fs               = require('fs');

/**
 * CategoryController class.
 */
module.exports = StoreAddressController = Controller.extend({

  baseUrl: "/storeaddress",

  initialize: function () {
    this.storeAddressDao = new StoreAddressDao();
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
    this.storeAddressDao.getAll().success(function (storeAddresses) {
      response.render('storeAddress/index', {'storeAddresses': storeAddresses});
    });
  },

  _index: function(request, response) {
    this.storeAddressDao.getAll().success(function (storeAddresses) {
      response.render('storeAddress/_index', {'storeAddresses': storeAddresses});
    });
  },

  show: function(request, response) {
    var self = this;
    var id = request.params.id;
    this.storeAddressDao.get(id).success(function (storeaddress) {
      if(!storeaddress){
        request.flash('danger', 'Aucune adresse avec l\'id : ' + id);
        response.redirect(self.baseUrl+'/_index');
      }else{
        response.render('storeAddress/show', {'storeaddress': storeaddress});
      }
    });
  },

  new: function (request, response) {
    response.render('storeAddress/new');
  },

  create: function (request, response) {
    var self = this;
    var storeaddress = request.body.storeaddress;
    this.storeAddressDao.save(storeaddress, function(modelError, storeaddress){
      if(modelError){
        request.flash('danger', self._parseValidationError(modelError));
        response.redirect('/storeaddress/new');
      }else{
        request.flash('success', 'Adresse sauvegardée');
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  edit: function (request, response) {
    var id = request.params.id;
    this.storeAddressDao.get(id).success(function (storeaddress) {
      response.render('storeAddress/edit', {'storeaddress': storeaddress, 'errors': null });
    });
  },

  update: function (request, response) {
    var self = this;
    var properties = request.body.storeaddress;
    this.storeAddressDao.update(properties, function (modelError, storeaddress) {
      if(storeaddress){
        if(modelError){
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/storeaddress/edit/' + properties.id);
        }else{
          request.flash('success', 'Adresse mis à jour');
          response.redirect(self.baseUrl+'/_index');
        }
      }else{
        request.flash('danger', 'Aucune adresse avec l\'id : ' + properties.id);
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  delete: function (request, response) {
    var id = request.params.id;
    this.storeAddressDao.get(id).success(function (storeaddress) {
      response.render('storeAddress/delete', { 'storeaddress': storeaddress });
    }).error(function (error) {
      request.flash('danger', 'Aucune adresse avec l\'id : ' + id);
      response.redirect(self.baseUrl);
    });
  },

  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    self.offerTypeDao.delete(id, function () {
      request.flash('success', 'Adresse supprimée');
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
