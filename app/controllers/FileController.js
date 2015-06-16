/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var commonFltrs   = require('../filters/commons');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var FileDao       = require('../dao/FileDao');
var _             = require('lodash');
var async         = require('async');
var moment        = require('moment');
var fs            = require('fs');
var multer        = require('multer');
var LinkDao       = require('../dao/LinkDao');

/**
 * FileController class.
 */
module.exports = FileController = Controller.extend({

  baseUrl: "/file",

  initialize: function () {
    this.fileDao = new FileDao();
    this.linkDao = new LinkDao();
  },

  filters: [
    //securityFltrs.authorize,
    csrfFltrs.csrf
  ],

  routes: {
    'get /'           : { action: 'index', filters: [ securityFltrs.authorizeModuleFile ]},
    'get /_index'     : { action: '_index', filters: [ securityFltrs.authorize ] },
    'get /show/:id'   : { action: 'show', filters: [ securityFltrs.authorize ] },
    'get /new'        : { filters:[csrfFltrs.antiForgeryToken, securityFltrs.authorize ], action: 'new' },
    'post /create'    : { action: 'create', filters: [ securityFltrs.authorize ] },
    'get /edit/:id'   : { filters:[csrfFltrs.antiForgeryToken, securityFltrs.authorize], action: 'edit' },
    'post /update'    : { filters:[csrfFltrs.antiForgeryToken, securityFltrs.authorize], action: 'update' },
    'get /delete/:id' : { filters:[csrfFltrs.antiForgeryToken, securityFltrs.authorize], action: 'delete' },
    'post /destroy'   : { action: 'destroy', filters: [ securityFltrs.authorize ] },
    'get /login'      : { filters:[csrfFltrs.antiForgeryToken], action: 'login' },
    'post /logon'     : 'logon',
    'get /logout'     : 'logout'
  },

  logout: function(request, response){
    request.session.authmodulefile = null;
    response.redirect('/');
  },

  index: function(request, response) {
    var self = this;
    self.linkDao.getAllByOrder().success( function(links){
      self.fileDao.getAll().success(function (files) {
        response.render('themes/'+response.locals.options.theme+'/fileIndex', {links: links, files: files, seoTitle: response.locals.options.modules.file.title});
      });
    });
  },

  login: function(request, response){
    var returnUrl = request.query.returnUrl;
    if( !returnUrl ) returnUrl = '/telechargement';
    response.render('file/login', {returnUrl: returnUrl});
  },

  logon: function(request, response){
    var self = this;
    var password = request.body.password;
    if( password === response.locals.options.modules.file.password ){
      request.session.authmodulefile = true;
      response.redirect(request.body.returnUrl);
    }else{
      request.session.authmodulefile = null;
      request.flash('danger', 'Mauvais mot de passe !');
      response.redirect(self.baseUrl+'/login');
    }
  },

  _index: function(request, response) {
    var self = this;
    self.fileDao.getAll().success(function (files) {
      async.map(files, function(file, callback){
        file.date = moment(file.createdAt);
        callback(null, file);
      }, function(err, transformed){
        response.render('file/_index', {
          files: transformed
        });
      });
    });
  },

  show: function(request, response) {
    var id = request.params.id;
    this.fileDao.get(id).success(function (file) {
      if(!file){
        request.flash('danger', 'Aucun fichier avec l\'id : ' + id);
        response.redirect(self.baseUrl);
      }else{
        response.render('file/show', {'file': file});
      }
    });
  },

  new: function (request, response) {
    response.render('file/new');
  },

  create: function (request, response) {
    var self = this;
    var file = request.body.file;
    file.file = request.files.file.name;
    fs.exists(request.files.file.path, function (exists) {
      if( exists ){
        self.fileDao.save(file, function(modelError, file){
          if(modelError){
            request.flash('danger', self._parseValidationError(modelError));
            response.redirect('/file/new');
          }else{
            request.flash('success', 'Fichier sauvegardé.');
            response.redirect(self.baseUrl+'/_index');
          }
        });
      }else{
        request.flash('danger', 'Erreur lors de l\'hébergement du fichier.');
        response.redirect('/file/new');
      }
    });
  },

  edit: function (request, response) {
    var id = request.params.id;
    this.fileDao.get(id).success(function (file) {
      response.render('file/edit', {'file': file, 'errors': null });
    });
  },

  update: function (request, response) {
    var self = this;
    var properties = request.body.file;
    this.fileDao.update(properties, function (modelError, file) {
      if(file){
        if(modelError){
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/file/edit/' + properties.id);
        }else{
          request.flash('success', 'Fichier mis à jour.');
          response.redirect(self.baseUrl+'/_index');
        }
      }else{
        request.flash('danger', 'Aucun fichier avec l\'id : ' + properties.id);
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  delete: function (request, response) {
    var id = request.params.id;
    this.fileDao.get(id).success(function (file) {
      response.render('file/delete', { 'file': file });
    }).error(function (error) {
      request.flash('danger', 'Aucun fichier avec l\'id : ' + id);
      response.redirect(self.baseUrl+'/_index');
    });
  },

  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    self.fileDao.get(id).success( function(file){
      fs.unlinkSync('public/uploads/'+file.file);
      self.fileDao.delete(id, function (error) {
        request.flash('success', 'Fichier supprimée.');
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
