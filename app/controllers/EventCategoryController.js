/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var commonFltrs   = require('../filters/commons');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var EventCategoryDao    = require('../dao/EventCategoryDao');
var _             = require('lodash');

/**
 * AppointmentCategoryController class.
 */
module.exports = EventCategoryController = Controller.extend({

  baseUrl: "/event/category",

  initialize: function () {
    this.eventCategoryDao = new EventCategoryDao();
  },

  filters: [
    securityFltrs.authorize,
    csrfFltrs.csrf
  ],

  routes: {
    'get /'           : 'index',
    'get /show/:id'   : 'show',
    'get /new'        : { filters:[ csrfFltrs.antiForgeryToken ], action: 'new' },
    'post /create'    : 'create',
    'get /edit/:id'   : { filters:[ csrfFltrs.antiForgeryToken ], action: 'edit' },
    'post /update'    : { filters:[ csrfFltrs.antiForgeryToken ], action: 'update' },
    'get /delete/:id' : { filters:[ csrfFltrs.antiForgeryToken ], action: 'delete' },
    'post /destroy'   : 'destroy'
  },


  index: function(request, response) {
    this.eventCategoryDao.getAll().success(function (categories) {
      response.render('eventCategory/index', {'categories': categories});
    });
  },

  /**
     * Show appointment category
     * GET
     */
  show: function(request, response) {
    var id = request.params.id;
    this.eventCategoryDao.get(id).success(function (category) {
      if(!category){
        request.flash('danger', 'Aucune catégorie avec l\'id : ' + id);
        response.redirect(self.baseUrl);
      }else{
        response.render('eventCategory/show', {'category': category});
      }
    });
  },

  /**
     * New appointment category
     * GET
     */
  new: function (request, response) {
    response.render('eventCategory/new');
  },

  /**
     * Create category
     * POST
     */
  create: function (request, response) {
    var self = this;
    var category = request.body.category;
    this.eventCategoryDao.save(category, function(modelError, category){
      if(modelError){
        request.flash('danger', self._parseValidationError(modelError));
        response.redirect('eventCategory/new');
      }else{
        request.flash('success', 'Categorie sauvegardée.');
        response.redirect(self.baseUrl);
      }
    });
  },

  /**
     * Edit appointment category
     * GET
     */
  edit: function (request, response) {
    var id = request.params.id;
    this.eventCategoryDao.get(id).success(function (category) {
      response.render('eventCategory/edit', {'category': category, 'errors': null });
    });
  },

  /**
     * Update appointment category
     * POST
     */
  update: function (request, response) {
    var self = this;
    var properties = request.body.category;
    this.eventCategoryDao.update(properties, function (modelError, category) {
      if(category){
        if(modelError){
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('eventCategory/edit/' + properties.id);
        }else{
          request.flash('success', 'Catégorie mise à jour.');
          response.redirect(self.baseUrl);
        }
      }else{
        request.flash('danger', 'Aucune catégorie avec l\'id : ' + properties.id);
        response.redirect(self.baseUrl);
      }
    });
  },

  /**
     * Delete appointment category
     * GET
     */
  delete: function (request, response) {
    var id = request.params.id;
    this.eventCategoryDao.get(id).success(function (category) {
      response.render('eventCategory/delete', { 'category': category });
    }).error(function (error) {
      request.flash('danger', 'Aucune catégorie avec l\'id : ' + id);
      response.redirect(self.baseUrl);
    });
  },

  /**
     * Destroy appointment category
     * POST
     */
  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    this.eventCategoryDao.delete(id, function (error) {
      if(error){
        request.flash('danger', error);
      }else{
        request.flash('success', 'Catégorie supprimée.');
      }
      response.redirect(self.baseUrl);
    });
  },

  /**
     * Parse errors returned by model validation.
     */
  _parseValidationError: function (modelError) {
    if(_.isString(modelError)){ return modelError; }

    var errors = [];
    for (var key in modelError) {
      errors.push(modelError[key]);
    }
    return errors.join('<br>');
  }
});
