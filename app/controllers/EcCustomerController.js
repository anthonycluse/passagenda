/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var EcCustomerDao       = require('../dao/EcCustomerDao');
var EcProductDao       = require('../dao/EcProductDao');
var passport      = require('passport');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var _             = require('lodash');
var fs            = require('fs');

/**
 * HomeController class.
 */
module.exports = EcCustommerController = Controller.extend({

  baseUrl: "/eccustomer",

  initialize: function () {
    this.ecProductDao = new EcProductDao();
    this.ecCustomerDao = new EcCustomerDao();
  },

  filters:[
    csrfFltrs.csrf
  ],

  routes: {
    'get /'                               : { action: 'login', filters:[csrfFltrs.antiForgeryToken] },
    'get /_index'                         : { action: '_index', filters:[csrfFltrs.antiForgeryToken] },
    'get /login'                          : { action: 'login', filters:[csrfFltrs.antiForgeryToken] },
    'post /create'                        : { action: 'create' },
    'get /new'                            : { action: 'new', filters:[csrfFltrs.antiForgeryToken, securityFltrs.authorizeAdmin] },
    'get /logout'                         : { action: 'logout' },
    'post /logon'                         : { action: 'logon', filters:[passport.authenticate('local', { failureRedirect: '/user/'})]},
    'get /edit/:id'                       : { action: 'edit', filters:[ securityFltrs.authorize, csrfFltrs.antiForgeryToken]},
    'post /updatepassword'                : { action: 'updatePassword' },
    'post /update'                        : { action: 'update' },
    'get /delete/:id'                     : { action: 'delete', filters:[ securityFltrs.authorizeSuperAdmin, csrfFltrs.antiForgeryToken]},
    'post /destroy'                       : { action: 'destroy', filters:[ securityFltrs.authorizeSuperAdmin ] },
    'get /_index/page/:id'                : { action: '_index', filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ] },
    'get /_search/page/:id/:search'       : { action: '_search', filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ] },
    'post /search'                        : { filters:[csrfFltrs.antiForgeryToken], action: '_search' }
  },

  delete: function(request, response){
    var id = request.params.id;
    this.ecCustomerDao.get(id).success( function(customer){
      response.render('eccustomer/delete', {customer: customer});
    });
  },

  destroy: function (request, response) {
    var id = request.body.id;
    this.ecCustomerDao.delete(id, function (error) {
      request.flash('success', 'Client supprimée');
      response.redirect('/eccustomer/_index');
    });
  },

  _index: function(request, response){
    var self = this;
    var id = request.params.id || 1;
    var limit = parseInt(response.locals.options.numberOfLines) || 10;
    var offset = ( ( id * limit ) - limit ) || 0;
    self.ecCustomerDao.getAll().success( function(allCustomers){
      self.ecCustomerDao.getAllByPage(offset, limit).success(function (customers) {
        response.render('eccustomer/_index', {customers: customers, allCustomers: allCustomers, id: id});
      });
    });
  },

  _search: function(request, response){
    var self = this,
      id = request.params.id || 1,
      limit = parseInt(response.locals.options.numberOfLines) || 10,
      offset = ( ( id * limit ) - limit ) || 0,
      search = request.body.search || request.params.search;
    self.ecCustomerDao.getAllSearch(search).success( function(allCustomers){
      self.ecCustomerDao.getAllSearchByPage(search, offset, limit).success(function (customers) {
        response.render('eccustomer/_search', {customers: customers, allCustomers: allCustomers, id: id, search: search});
      });
    });
  },

  login: function(request, response) {
    var returnUrl = request.query.returnUrl;
    if( !returnUrl ) returnUrl = '/';
    response.render('user/login', {returnUrl: returnUrl, layoutFile: false});
  },

  logon: function(request, response) {
    request.flash('success', 'Connexion réussie');
    response.redirect(request.body.returnUrl);
  },

  logout: function(request, response) {
    request.logout();
    response.redirect('/glovebox');
  },

  edit: function (request, response) {
    this.ecCustomerDao.get(request.params.id).success( function(customer){
      response.render('eccustomer/edit', {customer: customer});
    });
  },

  new: function(request, response) {
    response.render('eccustomer/new');
  },

  create: function(request, response) {
    var self = this;
    var customer = request.body.customer;
    if(customer.password === customer.confirmPassword && customer.password.length > 6){
      this.ecCustomerDao.getByEmail(customer.email).success(function (findedCustomer) {
        if(!findedCustomer){
          self.ecCustomerDao.save(customer, function (error, customer) {
            if(error){
              request.flash('danger', self._parseValidationError(error));
              response.redirect('/eccustomer/new');
            }else{
              request.flash('success', 'Enregistrement éffectué');
              response.redirect('/eccustomer/_index');
            }
          });
        }else{
          request.flash('danger', 'Ce nom utilisateur existe déjà');
          response.redirect('/eccustomer/new');
        }
      });
    }else{
      request.flash('danger', 'Le mot de passe doit faire au miminum six caractères ! Ou il y a une erreur avec le mot de passe de confirmation...');
      response.redirect('/eccustomer/new');
    }
  },

  /**
     * POST
     * update password
     */
  updatePassword: function (request, response) {
    var self = this;
    var model = request.body;
    if(model.newPassword === model.confirmNewPassword && model.newPassword.length > 6){
      this.ecCustomerDao.updatePassword(
        request.user.id, model.oldPassword, model.newPassword,
        function (err, user) {
          if(err){
            request.flash('danger', self._parseValidationError(err));
            response.redirect('/user/settings');
          }else{
            request.flash('success', 'Votre mot de passe a bien été mis à jour');
            response.redirect('/');
          }
        });
    }else{
      request.flash('danger', 'Le mot de passe doit faire au miminum six caractères ! Ou il y a une erreur avec le mot de passe de confirmation...')
      response.redirect('/user/settings');
    }
  },

  update: function (request, response) {
    var self = this;
    var customer = request.body.customer;
    this.ecCustomerDao.update(customer.id, customer, function(err, customer){
      if(err){
        request.flash('danger', self._parseValidationError(err));
        response.redirect('/eccustomer/edit/'+customer.id);
      }else{
        request.flash('success', 'Profil mis à jour');
        response.redirect('/eccustomer/_index');
      }
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
