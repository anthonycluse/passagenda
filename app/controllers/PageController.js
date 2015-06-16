/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var commonFltrs   = require('../filters/commons');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var PageDao       = require('../dao/PageDao');
var LinkDao       = require('../dao/LinkDao');
var _             = require('lodash');
var moment        = require('moment');
var async         = require('async');

//var rewriter = require('express-rewrite');

/**
 * ArticleController class.
 */
module.exports = PageController = Controller.extend({

  baseUrl: "/page",

  initialize: function () {
    this.pageDao = new PageDao();
    this.linkDao = new LinkDao();
  },

  filters: [
    //securityFltrs.authorize,
    csrfFltrs.csrf
  ],

  routes: {
    'get /'                   : 'index',
    'get /_index'             : { action: '_index', filters:[ csrfFltrs.antiForgeryToken,  securityFltrs.authorize] },
    'get /show/:id/:seoUrl'   : { action: 'show' },
    'get /new'                : { filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ], action: 'new' },
    'post /create'            : { action: 'create', filters: [ securityFltrs.authorize ] },
    'get /edit/:id'           : { filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ], action: 'edit' },
    'post /update'            : { filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ], action: 'update' },
    'get /delete/:id'         : { filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ], action: 'delete' },
    'post /destroy'           : { action: 'destroy', filters: [ securityFltrs.authorize ] },
    'get /:state'             : { action: 'index', filters: [ securityFltrs.authorize ] }
  },

  /**
     * List Articles
     * GET
     */
  _index: function(request, response) {
    if( request.params.state ){
      var state = request.params.state;
      switch(state){
        case 'online':
          this.pageDao.getAllOnline().success(function (pages) {
            async.map(pages, function(page, callback){
              page.date = moment(page.createdAt);
              callback(null, page);
            }, function(err, transformed){
              response.render('page/_index', {pages: transformed});
            });
          });
          break;
        case 'offline':
          this.pageDao.getAllOffline().success(function (pages) {
            async.map(pages, function(page, callback){
              page.date = moment(page.createdAt);
              callback(null, page);
            }, function(err, transformed){
              response.render('page/_index', {pages: transformed});
            });
          });
          break;
      };
    }else{
      this.pageDao.getAll().success(function (pages) {
        async.map(pages, function(page, callback){
          page.date = moment(page.createdAt);
          callback(null, page);
        }, function(err, transformed){
          response.render('page/_index', {pages: transformed});
        });
      });
    }
  },


  index: function(request, response) {
    var self = this;
    self.linkDao.getAllByOrder().success( function(links){
      self.pageDao.getAllOnline().success(function (pages) {
        async.map(pages, function(page, callback){
          page.date = moment(page.createdAt);
          callback(null, page);
        }, function(err, transformed){
          response.render('page/index', {pages: transformed, links: links});
        });
      });
    });
  },

  /**
     * Show Article
     * GET
     */
  show: function(request, response) {
    var self = this;
    var id = request.params.id;
    self.linkDao.getAllByOrder().success(function (links) {
      self.pageDao.get(id).success(function (page) {
        if(!page){
          request.flash('danger', 'Aucune page avec l\'identifiant ' + id +'.');
          response.redirect(self.baseUrl);
        }else{
          response.render('themes/'+response.locals.options.theme+'/pageShow', {'page': page, links: links});
        }
      });
    });
  },

  /**
     * New Article
     * GET
     */
  new: function (request, response) {
    response.render('page/new');
  },

  /**
     * Create Article
     * POST
     */
  create: function (request, response) {
    var self = this;
    var page = request.body.page;
    console.log(page);
    this.pageDao.save(page, function(modelError, page){
      if(modelError){
        request.flash('danger', self._parseValidationError(modelError));
        response.redirect('/page/new');
      }else{
        request.flash('success', 'Page ajouté.');
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  /**
     * Edit Article
     * GET
     */
  edit: function (request, response) {
    var id = request.params.id;
    this.pageDao.get(id).success(function (page) {
      response.render('page/edit', {'page': page, 'errors': null });
    });
  },

  /**
     * Update Article
     * POST
     */
  update: function (request, response) {
    var self = this;
    var properties = request.body.page;
    this.pageDao.update(properties, function (modelError, page) {
      if(page){ // article found
        if(modelError){ // but properties validation error
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/page/edit/' + properties.id);
        }else{
          request.flash('success', 'Page mise à jour.');
          response.redirect(self.baseUrl+'/_index');
        }
      }else{
        request.flash('danger', 'Aucune page avec l\'identifiant ' + properties.id +'.');
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  /**
     * Delete Article
     * GET
     */
  delete: function (request, response) {
    var id = request.params.id;
    this.pageDao.get(id).success(function (page) {
      response.render('page/delete', { 'page': page });
    }).error(function (error) {
      request.flash('danger', 'Aucune page avec l\'identifiant ' + id +'.');
      response.redirect(self.baseUrl+'/_index');
    });
  },

  /**
     * Destroy Article
     * POST
     */
  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    this.pageDao.delete(id, function (error) {
      request.flash('success', 'Page supprimé.');
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
