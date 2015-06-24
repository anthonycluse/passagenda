var Controller    = require('microscope-web').Controller;
var OfferDao       = require('../dao/OfferDao');
var OfferStoreDao       = require('../dao/OfferStoreDao');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var _             = require('lodash');

module.exports = PromotionController = Controller.extend({

  baseUrl: "/promotion",

  initialize: function () {
    this.offerDao = new OfferDao();
    this.offerStoreDao = new OfferStoreDao();
  },

  filters:[
    csrfFltrs.csrf,
    securityFltrs.authorize
  ],

  routes: {
    'get /' : { action: '_index', ignoreBaseUrl: true, filters:[csrfFltrs.antiForgeryToken] },
  },


  _index: function(request, response){
    var self = this;
    self.offerDao.getLastTen().success( function(offers){
      self.offerStoreDao.getLastTen().success( function(offerstores){
        response.render('promotion/_index', {
          offers: offers,
          offerstores: offerstores
        });
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
