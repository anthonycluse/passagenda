/**
 * Imports.
 */
var Controller           = require('microscope-web').Controller;
var commonFltrs          = require('../filters/commons');
var securityFltrs        = require('../filters/security');
var csrfFltrs            = require('../filters/csrf');
var ArticleDao           = require('../dao/ArticleDao');
var LinkDao              = require('../dao/LinkDao');
var ArticleCategoryDao   = require('../dao/ArticleCategoryDao');
var _                    = require('lodash');
var moment               = require('moment');
var async                = require('async');
var cheerio              = require('cheerio');
var fs                   = require('fs');

/**
 * ArticleController class.
 */
module.exports = ArticleController = Controller.extend({

  baseUrl: "/article",

  initialize: function () {
    this.articleDao = new ArticleDao();
    this.articleCategoryDao = new ArticleCategoryDao();
    this.linkDao = new LinkDao();
  },

  filters: [
    csrfFltrs.csrf
  ],

  routes: {
    'get /'                       : 'index',
    'get /page/:id'               : 'index',
    'get /_index'                 : { action: '_index', filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ] },
    'get /_index/page/:id'        : { action: '_index', filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ] },
    'get /show/:id/:seoUrl'       : { action: 'show' },
    'get /new'                    : { filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ], action: 'new' },
    'post /create'                : { action: 'create', filters:[ securityFltrs.authorize ] },
    'get /edit/:id'               : { filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ], action: 'edit' },
    'post /update'                : { filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ], action: 'update' },
    'get /delete/:id'             : { filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ], action: 'delete' },
    'post /destroy'               : { action: 'destroy', filters:[ securityFltrs.authorize ] },
    'get /:state'                 : 'index'
  },

  _index: function(request, response) {
    var self = this;
    var id = request.params.id || 1;
    var limit = parseInt(response.locals.options.numberOfLines) || 10;
    var offset = ( ( id * limit ) - limit ) || 0;
    self.articleDao.getAll().success( function(allArticles){
      self.articleDao.getAllByPage(offset, limit).success(function (articles) {
        async.map(articles, function(article, callback){
          article.date = moment(article.createdAt);
          callback(null, article);
        }, function(err, transformed){
          response.render('article/_index', {articles: transformed, allArticles: allArticles, id: id});
        });
      });
    });
  },

  index: function(request, response) {
    var self = this;
    var id = request.params.id || 1;
    var limit = parseInt(response.locals.options.numberOfLines) || 10;
    var offset = ( ( id * limit ) - limit ) || 0;
    self.linkDao.getAllByOrder().success( function(links){
      self.articleDao.getAllOnline().success( function(allArticles){
        self.articleDao.getAllOnlineByPage(offset, limit).success(function (articles) {
          async.map(articles, function(article, callback){
            article.date = moment(article.createdAt);
            callback(null, article);
          }, function(err, transformed){
            response.render('themes/'+response.locals.options.theme+'/articleIndex', {links: links, articles: transformed, allArticles: allArticles, id: id, seoTitle: response.locals.options.modules.blog.title});
          });
        });
      });
    });
  },

  show: function(request, response) {
    var self = this;
    var id = request.params.id;
    self.linkDao.getAllByOrder().success( function(links){
      self.articleDao.get(id).success(function (article) {
        if(!article){
          request.flash('danger', 'Aucun article avec l\'identifiant ' + id +'.');
          response.redirect(self.baseUrl);
        }else{
          console.log(request.headers);
          response.render('themes/'+response.locals.options.theme+'/articleShow', {'article': article, links: links});
        }
      });
    });
  },

  new: function (request, response) {
    this.articleCategoryDao.getAll().success( function(categories){
      if( categories.length > 0 ){
        response.render('article/new', {'categories': categories});
      }else{
        request.flash('danger', 'Vous devez ajouter au moins une catégorie pour ajouter un article.');
        response.redirect('/article/_index');
      }
    });
  },

  create: function (request, response) {
    var self = this,
        article = request.body.article;
    article.thumbnail = (request.files.thumbnail && request.files.thumbnail.name) || null;
    self.articleDao.save(article, function(modelError, article){
      if(modelError){
        request.flash('danger', self._parseValidationError(modelError));
        response.redirect('/article/new');
      }else{
        request.flash('success', 'Article ajouté.');
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  edit: function (request, response) {
    var id = request.params.id;
    this.articleDao.get(id).success(function (article) {
      response.render('article/edit', {'article': article, 'errors': null });
    });
  },

  update: function (request, response) {
    var self = this;
    var properties = request.body.article;
    this.articleDao.update(properties, function (modelError, article) {
      if(article){ // article found
        if(modelError){ // but properties validation error
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/article/edit/' + properties.id);
        }else{
          request.flash('success', 'Article mis à jour.');
          response.redirect(self.baseUrl+'/_index');
        }
      }else{
        request.flash('danger', 'Aucun article avec l\'identifiant ' + properties.id +'.');
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  delete: function (request, response) {
    var id = request.params.id;
    this.articleDao.get(id).success(function (article) {
      response.render('article/delete', { 'article': article });
    }).error(function (error) {
      request.flash('danger', 'Aucun article avec l\'identifiant ' + id +'.');
      response.redirect(self.baseUrl+'/_index');
    });
  },

  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    self.articleDao.get(id).success( function(article){
      if (article.thumbnail) {
        fs.unlinkSync('public/uploads/'+article.thumbnail);
      }
      self.articleDao.delete(id, function (error) {
        request.flash('success', 'Article supprimé.');
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
