/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var commonFltrs   = require('../filters/commons');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var MediaDao      = require('../dao/MediaDao');
var _             = require('lodash');
var async         = require('async');
var moment        = require('moment');
var fs            = require('fs');

/**
 * MediaController class.
 */
module.exports = MediaController = Controller.extend({

  baseUrl: "/media",

  initialize: function () {
    this.mediaDao = new MediaDao();
  },

  filters: [
    securityFltrs.authorize,
    //csrfFltrs.csrf
  ],

  routes: {
    'get /'           : 'index',
    'get /_index'           : '_index',
    'get /show/:id'   : 'show',
    'get /new'        : { /*filters:[csrfFltrs.antiForgeryToken],*/ action: 'new' },
    'post /create'    : 'create',
    'get /edit/:id'   : { /*filters:[csrfFltrs.antiForgeryToken],*/ action: 'edit' },
    'post /update'    : { /*filters:[csrfFltrs.antiForgeryToken],*/ action: 'update' },
    'get /delete/:id' : { /*filters:[csrfFltrs.antiForgeryToken],*/ action: 'delete' },
    'post /destroy'   : 'destroy',
    'post /ckeditor/create' : {action: 'ckeditor'}
  },

  _index: function(request, response) {
    this.mediaDao.getAll().success(function (medias) {
      async.map(medias, function(media, callback){
        media.date = moment(media.createdAt);
        callback(null, media);
      }, function(err, transformed){
        response.render('media/index', {
          medias: transformed
        });
      });
    });
  },

  show: function(request, response) {
    var id = request.params.id;
    this.mediaDao.get(id).success(function (media) {
      if(!media){
        request.flash('danger', 'Aucun média avec l\'id : ' + id);
        response.redirect(self.baseUrl);
      }else{
        response.render('media/show', {'media': media});
      }
    });
  },

  new: function (request, response) {
    response.render('media/new');
  },

  create: function (request, response) {
    var self = this;
    var media = request.body.media;
    media.file = request.files.file.name;
    fs.exists(request.files.file.path, function (exists) {
      if( exists ){
        self.mediaDao.save(media, function(modelError, media){
          if(modelError){
            request.flash('danger', self._parseValidationError(modelError));
            response.redirect('/media/new');
          }else{
            request.flash('success', 'Média sauvegardé.');
            response.redirect(self.baseUrl+'/_index');
          }
        });
      }else{
        request.flash('danger', 'Erreur lors de l\'hébergement du fichier.');
        response.redirect('/media/new');
      }
    });
  },

  ckeditor: function (request, response) {
    var self = this;
    var media = {
      title: request.files.upload.originalname,
      file: request.files.upload.name
    };
    fs.exists(request.files.upload.path, function (exists) {
      if( exists ){
        self.mediaDao.save(media, function(modelError, media){
          if(modelError){
            request.flash('danger', self._parseValidationError(modelError));
            response.redirect('/article/new');
          }else{
            var html = "";
            html += "<script type='text/javascript'>";
            html += "    var funcNum = " + request.query.CKEditorFuncNum + ";";
            html += "    var url     = \"/uploads/" + media.file + "\";";
            html += "    var message = \"Fichier uploadé !\";";
            html += "";
            html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
            html += "</script>";
            response.send(html);
          }
        });
      }else{
        request.flash('danger', 'Erreur avec le fichier.');
        response.redirect('/article/new');
      }
    });
  },

  edit: function (request, response) {
    var id = request.params.id;
    this.mediaDao.get(id).success(function (media) {
      response.render('media/edit', {'media': media, 'errors': null });
    });
  },

  update: function (request, response) {
    var self = this;
    var properties = request.body.media;
    this.mediaDao.update(properties, function (modelError, media) {
      if(media){ // media found
        if(modelError){ // but properties validation error
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/media/edit/' + properties.id);
        }else{
          request.flash('success', 'Média mis à jour.');
          response.redirect(self.baseUrl+'/_index');
        }
      }else{
        request.flash('danger', 'Aucun média avec l\'id : ' + properties.id);
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },


  delete: function (request, response) {
    var id = request.params.id;
    this.mediaDao.get(id).success(function (media) {
      response.render('media/delete', { 'media': media });
    }).error(function (error) {
      request.flash('danger', 'Aucun média avec l\'id : ' + id);
      response.redirect(self.baseUrl+'/_index');
    });
  },

  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    this.mediaDao.get(id).success( function(media){
      fs.unlinkSync('public/uploads/'+media.file);
      self.mediaDao.delete(id, function (error) {
        request.flash('success', 'Média supprimée.');
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
