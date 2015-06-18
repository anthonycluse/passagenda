var Controller        = require('microscope-web').Controller;
var commonFltrs       = require('../filters/commons');
var securityFltrs     = require('../filters/security');
var csrfFltrs         = require('../filters/csrf');
var OfferCategoryDao  = require('../dao/OfferCategoryDao');
var _                 = require('lodash');
var fs                = require('fs');

module.exports = OfferTypeController = Controller.extend({

  baseUrl: "/offercategory",

  initialize: function () {
    this.offerCategoryDao = new OfferCategoryDao();
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
    this.offerCategoryDao.getAll().success(function (offercategories) {
      response.render('offerCategory/index', {'offercategories': offercategories});
    });
  },

  _index: function(request, response) {
    this.offerCategoryDao.getAll().success(function (offercategories) {
      response.render('offerCategory/_index', {'offercategories': offercategories});
    });
  },

  show: function(request, response) {
    var self = this;
    var id = request.params.id;
    this.offerCategoryDao.get(id).success(function (offercategory) {
      if(!offercategory){
        request.flash('danger', 'Aucune catégorie avec l\'id : ' + id);
        response.redirect(self.baseUrl+'/_index');
      }else{
        response.render('offerCategory/show', {'offercategory': offercategory});
      }
    });
  },

  new: function (request, response) {
    response.render('offerCategory/new');
  },

  create: function (request, response) {
    var self = this;
    var offercategory = request.body.offercategory;
    this.offerCategoryDao.save(offercategory, function(modelError, offercategory){
      if(modelError){
        request.flash('danger', self._parseValidationError(modelError));
        response.redirect('/offercategory/new');
      }else{
        request.flash('success', 'Catégorie sauvegardée');
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  edit: function (request, response) {
    var id = request.params.id;
    this.offerCategoryDao.get(id).success(function (offercategory) {
      response.render('offerCategory/edit', {'offercategory': offercategory, 'errors': null });
    });
  },

  update: function (request, response) {
    var self = this;
    var properties = request.body.offercategory;
    this.offerCategoryDao.update(properties, function (modelError, offercategory) {
      if(offercategory){
        if(modelError){
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/offercategory/edit/' + properties.id);
        }else{
          request.flash('success', 'Catégorie mise à jour');
          response.redirect(self.baseUrl+'/_index');
        }
      }else{
        request.flash('danger', 'Aucune catégorie avec l\'id : ' + properties.id);
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  delete: function (request, response) {
    var id = request.params.id;
    this.offerCategoryDao.get(id).success(function (offercategory) {
      response.render('offerCategory/delete', { 'offercategory': offercategory });
    }).error(function (error) {
      request.flash('danger', 'Aucune catégorie avec l\'id : ' + id);
      response.redirect(self.baseUrl);
    });
  },

  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    self.offerCategoryDao.delete(id, function () {
      request.flash('success', 'Catégorie supprimée');
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
