var Controller    = require('microscope-web').Controller;
var OfferDao       = require('../dao/OfferDao');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var _             = require('lodash');

module.exports = PromotionController = Controller.extend({

  baseUrl: "/promotion",

  initialize: function () {
    this.offerDao = new OfferDao();
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
      response.render('promotion/_index', {offers: offers});
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
