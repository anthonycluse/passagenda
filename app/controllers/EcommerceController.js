/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var EcCustomerDao       = require('../dao/EcCustomerDao');
var EcProductDao       = require('../dao/EcProductDao');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var _             = require('lodash');

module.exports = EcCustommerController = Controller.extend({

  baseUrl: "/ecommerce",

  initialize: function () {
    this.ecProductDao = new EcProductDao();
    this.ecCustomerDao = new EcCustomerDao();
  },

  filters:[
    csrfFltrs.csrf,
    securityFltrs.authorize
  ],

  routes: {
    'get /' : { action: '_index', filters:[csrfFltrs.antiForgeryToken] },
  },


  _index: function(request, response){
    var self = this;
    self.ecProductDao.getLastTen().success( function(products){
      self.ecCustomerDao.getLastTen().success( function(customers){
        response.render('ecommerce/index', {products: products, customers: customers});
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
