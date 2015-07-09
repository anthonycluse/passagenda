var Controller        = require('microscope-web').Controller;
var commonFltrs       = require('../filters/commons');
var securityFltrs     = require('../filters/security');
var csrfFltrs         = require('../filters/csrf');
var OfferStoreDao     = require('../dao/OfferStoreDao');
var StorePhotoDao     = require('../dao/StorePhotoDao');
var StoreAddressDao   = require('../dao/StoreAddressDao');
var _                 = require('lodash');
var fs                = require('fs');
var async             = require('async');

module.exports = OfferStoreController = Controller.extend({

  baseUrl: "/offerstore",

  initialize: function () {
    this.offerStoreDao = new OfferStoreDao();
    this.storePhotoDao = new StorePhotoDao();
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
    this.offerStoreDao.getAll().success(function (offerstores) {
      response.render('offerStore/index', {'offerstores': offerstores});
    });
  },

  _index: function(request, response) {
    var self = this;

    this.offerStoreDao.getAll().success( function(offerstores){
      async.map(offerstores, function(offerstore, callback){
        self.storeAddressDao.getAllByStore(offerstore.id).success( function(addresses){
          self.storePhotoDao.getAllByStore(offerstore.id).success( function(photos){
            offerstore.addresses = addresses;
            offerstore.photos = photos;
            callback(null, offerstore);
          });
        });
      }, function(err, transformed){
        response.render('offerStore/_index', {offerstores: transformed});
      });
    });




  },

  show: function(request, response) {
    var self = this;
    var id = request.params.id;
    this.offerStoreDao.get(id).success(function (offerstore) {
      if(!offerstore){
        request.flash('danger', 'Aucune boutique avec l\'id : ' + id);
        response.redirect(self.baseUrl+'/_index');
      }else{
        response.render('offerStore/show', {'offerstore': offerstore});
      }
    });
  },

  new: function (request, response) {
    response.render('offerStore/new');
  },

  create: function (request, response) {
    var self = this;
    var offerstore = request.body.offerstore;
    var storeaddress = request.body.storeaddress;
    var photos = request.files.photos;
    this.offerStoreDao.save(offerstore, function(modelError, offerstore){
      if(modelError){
        request.flash('danger', self._parseValidationError(modelError));
        response.redirect('/offerstore/new');
      }else{
        if( photos.length > 1 ){
          _.forEach(photos, function(photo){
            photo.OfferStoreId = offerstore.id;
            photo.file = photo.name;
            self.storePhotoDao.save(photo, function(storePhoto){});
          });
        }else{
          photos.OfferStoreId = offerstore.id;
          photos.file = photos.name;
          self.storePhotoDao.save(photos, function(storePhoto){});
        }
        storeaddress.OfferStoreId = offerstore.id;
        self.storeAddressDao.save(storeaddress, function(modelError, offerstore) {
          if(modelError){
            request.flash('danger', self._parseValidationError(modelError));
            response.redirect('/offerstore/new');
          } else {
            request.flash('success', 'Boutique sauvegardée');
            response.redirect(self.baseUrl+'/_index');
          }
        });
      }
    });
  },

  edit: function (request, response) {
    var id = request.params.id;
    this.offerStoreDao.get(id).success(function (offerstore) {
      response.render('offerStore/edit', {'offerstore': offerstore, 'errors': null });
    });
  },

  update: function (request, response) {
    var self = this;
    var properties = request.body.offerstore;
    this.offerStoreDao.update(properties, function (modelError, offerstore) {
      if(offerstore){
        if(modelError){
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/offerstore/edit/' + properties.id);
        }else{
          request.flash('success', 'Boutique mise à jour');
          response.redirect(self.baseUrl+'/_index');
        }
      }else{
        request.flash('danger', 'Aucune boutique avec l\'id : ' + properties.id);
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  delete: function (request, response) {
    var id = request.params.id;
    this.offerStoreDao.get(id).success(function (offerstore) {
      response.render('offerStore/delete', { 'offerstore': offerstore });
    }).error(function (error) {
      request.flash('danger', 'Aucune boutique avec l\'id : ' + id);
      response.redirect(self.baseUrl);
    });
  },

  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    self.offerStoreDao.get(id).success( function(offerStore) {
      self.storePhotoDao.getAllByStoreId(offerStore.id).success( function(storePhotos) {
        if( storePhotos.length > 1 ){
          _.forEach(storePhotos, function(storePhoto){
            fs.unlinkSync('public/uploads/'+storePhoto.file);
            self.storePhotoDao.delete(storePhoto.id, function(){});
          });
          self.offerStoreDao.delete(id, function () {
            request.flash('success', 'Boutique supprimée');
            response.redirect(self.baseUrl+'/_index');
          });
        }else{
          fs.unlinkSync('public/uploads/'+storePhotos[0].file);
          self.storePhotoDao.delete(storePhotos[0].id, function(){
            self.offerStoreDao.delete(id, function () {
              request.flash('success', 'Boutique supprimée');
              response.redirect(self.baseUrl+'/_index');
            });
          });
        }
      });
    });
    /*self.offerStoreDao.delete(id, function () {
      request.flash('success', 'Boutique supprimée');
      response.redirect(self.baseUrl+'/_index');
    });*/
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
