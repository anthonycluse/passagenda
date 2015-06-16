/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var commonFltrs   = require('../filters/commons');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var LinkDao    = require('../dao/LinkDao');
var PageDao    = require('../dao/PageDao');
var ArticleDao    = require('../dao/ArticleDao');
var _             = require('lodash');

/**
 * MediaController class.
 */
module.exports = LinkController = Controller.extend({

  baseUrl: "/link",

  initialize: function () {
    this.linkDao = new LinkDao();
    this.pageDao = new PageDao();
    this.articleDao = new ArticleDao();
  },

  filters: [
    securityFltrs.authorize,
    csrfFltrs.csrf
  ],

  routes: {
    'get /_index'             : { action: '_index' },
    'get /show/:id'           : 'show',
    'get /new'                : { filters:[csrfFltrs.antiForgeryToken], action: 'new' },
    'post /create'            : 'create',
    'get /edit/:id'           : { filters:[csrfFltrs.antiForgeryToken], action: 'edit' },
    'post /update'            : { filters:[csrfFltrs.antiForgeryToken], action: 'update' },
    'get /delete/:id'         : { filters:[csrfFltrs.antiForgeryToken], action: 'delete' },
    'post /destroy'           : 'destroy',
    'get /updatePosition'     : { action: 'updatePosition' }
  },

  _index: function(request, response) {
    this.linkDao.getAllByOrder().success(function (links) {
      response.render('link/_index', {
        links: links
      });
    });
  },

  new: function (request, response) {
    var self = this;
    self.linkDao.getAll().success( function(links){
      self.pageDao.getAllOnline().success( function(pages){
        self.articleDao.getAllOnline().success( function(articles){
          response.render('link/new', {pages: pages, articles: articles, position: links.length, links: links});
        });
      });
    });
  },

  create: function (request, response) {
    var self = this;
    var link = request.body.link;
    self.linkDao.save(link, function(modelError, link){
      if(modelError){
        request.flash('danger', self._parseValidationError(modelError));
        response.redirect('/link/new');
      }else{
        request.flash('success', 'Média sauvegardé.');
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  updatePosition: function(request, response){
    var self = this;

    var id1 = request.query.id1;
    var position1 = request.query.position1;
    var id2 = request.query.id2;
    var position2 = request.query.position2;

    self.linkDao.get(id1).success(function (link) {
      link.dataValues.position = position1;
      self.linkDao.update(link, function (modelError, link) {
        if(link && !modelError ){
          self.linkDao.get(id2).success(function (link) {
            link.dataValues.position = position2;
            self.linkDao.update(link, function (modelError, link) {
              if(link || !modelError){
                response.send(self.baseUrl+'/_index');
              }
            });
          });
        }
      });
    });
  },

  edit: function (request, response) {
    var id = request.params.id;
    this.linkDao.get(id).success(function (link) {
      response.render('link/edit', {'link': link, 'errors': null });
    });
  },

  update: function (request, response) {
    var self = this;
    var properties = request.body.link;
    this.linkDao.update(properties, function (modelError, link) {
      if(link){
        if(modelError){
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/link/edit/' + properties.id);
        }else{
          request.flash('success', 'Lien mis à jour.');
          response.redirect(self.baseUrl+'/_index');
        }
      }else{
        request.flash('danger', 'Aucun lien avec l\'id : ' + properties.id);
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  delete: function (request, response) {
    var self = this;
    var id = request.params.id;
    self.linkDao.get(id).success(function (link) {
      response.render('link/delete', { 'link': link });
    }).error(function (error) {
      request.flash('danger', 'Aucun lien avec l\'id : ' + id);
      response.redirect(self.baseUrl+'/_index');
    });
  },

  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    this.linkDao.get(id).success( function(link){
      self.linkDao.delete(id, function (error) {
        request.flash('success', 'Lien supprimée.');
        response.redirect(self.baseUrl+'/_index');
      });
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
