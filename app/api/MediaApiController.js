/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var MediaDao    = require('../dao/MediaDao');
var securityFltrs = require('../filters/security');
var moment = require('moment');
var async = require('async');

/**
 * ArticleController class.
 */
module.exports = Controller.extend({

  baseUrl: "/api/media",

  initialize: function () {
    this.mediaDao = new MediaDao();
  },

  filters:[
    //securityFltrs.authorize
  ],

  routes: {
    'get /'                       : 'getAll',
    'get /:id'                    : 'get',
    'post /'                      : 'post',
    'put /'                       : 'put',
    'delete /:id'                 : 'delete',
    'get /state/:state'           : 'getAll',
    'get /medias/ckeditor'        : {action: 'getAllCKEditor', ignoreBaseUrl: true}
  },

  getAllCKEditor: function(request, response){
    this.mediaDao.getAll().success( function(medias){
      async.map(medias, function(media, callback){
        media.dataValues.image = '/uploads/'+media.file;
        callback(null, media);
      }, function(err, transformed){
        console.log(transformed);
        response.json(transformed);
      });
    });
  },

  getAll: function(request, response) {
    this.mediaDao.getAll().success(function (medias) {
      response.json(medias);
    });
  },

  get: function (request, response) {
    var mediaId = request.params.id;
    this.mediaDao.get(mediaId).success(function (media) {
      if(media){
        response.json(media);
      }else{
        response.send("No media with id : " + mediaId);
      }
    });
  },

  post: function (request, response) {
    var self = this;
    var media = request.body;
    this.mediaDao.save(media, function(modelError, media){
      if(modelError){
        response.json(modelError);
      }else{
        response.json(media);
      }
    });
  },

  put: function (request, response) {
    var properties = request.body;
    this.mediaDao.update(properties, function (modelError, media) {
      if(media){ // article found
        if(modelError){ // but properties validation error
          response.json(modelError);
        }else{
          response.json(media);
        }
      }else{
        response.send(404);
      }
    });
  },

  delete: function (request, response) {
    var id = request.params.id;
    this.mediaDao.delete(id, function (error) {
      if(error){
        response.json(404);
      }else{
        response.json('media deleted');
      }
    });
  }
});
