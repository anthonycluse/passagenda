/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var commonFltrs   = require('../filters/commons');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var ProjectCategoryDao    = require('../dao/ProjectCategoryDao');
var _             = require('lodash');

/**
 * CategoryController class.
 */
module.exports = ProjectCategoryController = Controller.extend({

  baseUrl: "/project/category",

  initialize: function () {
    this.projectCategoryDao = new ProjectCategoryDao();
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

  /**
     * List categories
     * GET
     */
  index: function(request, response) {
    this.projectCategoryDao.getAll().success(function (categories) {
      response.render('projectCategory/index', {'categories': categories});
    });
  },

  /**
     * List categories
     * GET
     */
  _index: function(request, response) {
    this.projectCategoryDao.getAll().success(function (categories) {
      response.render('projectCategory/_index', {'categories': categories});
    });
  },

  /**
     * Show category
     * GET
     */
  show: function(request, response) {
    var self = this;
    var id = request.params.id;
    this.projectCategoryDao.get(id).success(function (category) {
      if(!category){
        request.flash('danger', 'Aucune catégorie avec l\'id : ' + id);
        response.redirect(self.baseUrl+'/_index');
      }else{
        response.render('projectCategory/show', {'category': category});
      }
    });
  },

  /**
     * New category
     * GET
     */
  new: function (request, response) {
    response.render('projectCategory/new');
  },

  /**
     * Create category
     * POST
     */
  create: function (request, response) {
    var self = this;
    var category = request.body.category;
    category.state == '1' ? category.state = true : category.state = false;
    this.projectCategoryDao.save(category, function(modelError, category){
      if(modelError){
        request.flash('danger', self._parseValidationError(modelError));
        response.redirect('/project/category/new');
      }else{
        request.flash('success', 'Categorie sauvegardée.');
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  /**
     * Edit category
     * GET
     */
  edit: function (request, response) {
    var id = request.params.id;
    this.projectCategoryDao.get(id).success(function (category) {
      response.render('projectCategory/edit', {'category': category, 'errors': null });
    });
  },

  /**
     * Update category
     * POST
     */
  update: function (request, response) {
    var self = this;
    var properties = request.body.category;
    properties.state == '1' ? properties.state = true : properties.state = false;
    this.projectCategoryDao.update(properties, function (modelError, category) {
      if(category){ // category found
        if(modelError){ // but properties validation error
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/project/category/edit/' + properties.id);
        }else{
          request.flash('success', 'Catégorie mise à jour.');
          response.redirect(self.baseUrl+'/_index');
        }
      }else{
        request.flash('danger', 'Aucune catégorie avec l\'id : ' + properties.id);
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  /**
     * Delete category
     * GET
     */
  delete: function (request, response) {
    var id = request.params.id;
    this.projectCategoryDao.get(id).success(function (category) {
      response.render('projectCategory/delete', { 'category': category });
    }).error(function (error) {
      request.flash('danger', 'Aucune catégorie avec l\'id : ' + id);
      response.redirect(self.baseUrl);
    });
  },

  /**
     * Destroy category
     * POST
     */
  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    this.projectCategoryDao.delete(id, function (error) {
      request.flash('success', 'Catégorie supprimée.');
      response.redirect(self.baseUrl+'/_index');
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
