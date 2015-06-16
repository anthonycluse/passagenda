/**
 * Imports.
 */
var Controller           = require('microscope-web').Controller;
var commonFltrs          = require('../filters/commons');
var securityFltrs        = require('../filters/security');
var csrfFltrs            = require('../filters/csrf');
var EcProductDao         = require('../dao/EcProductDao');
var EcCustomerDao        = require('../dao/EcCustomerDao');
var EcOrderDao           = require('../dao/EcOrderDao');
var EcOrderProductDao    = require('../dao/EcOrderProductDao');
var _                    = require('lodash');

/**
 * CategoryController class.
 */
module.exports = EcOrderController = Controller.extend({

  baseUrl: "/ecorderproduct",

  initialize: function () {
    this.ecProductDao = new EcProductDao();
    this.ecCustomerDao = new EcCustomerDao();
    this.ecOrderDao = new EcOrderDao();
    this.ecOrderProductDao = new EcOrderProductDao();
  },

  filters: [
    securityFltrs.authorize,
    csrfFltrs.csrf
  ],

  routes: {
    'get /'                               : 'index',
    'get /_index'                         : { filters:[ csrfFltrs.antiForgeryToken ], action: '_index' },
    'get /show/:id'                       : 'show',
    'get /_index/page/:id'                : { action: '_index', filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ] },
    'get /_search/page/:id/:search'       : { action: '_search', filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ] },
    'get /new'                            : { filters:[ csrfFltrs.antiForgeryToken ], action: 'new' },
    'post /create'                        : 'create',
    'get /edit/:id'                       : { filters:[ csrfFltrs.antiForgeryToken ], action: 'edit' },
    'post /update'                        : { filters:[ csrfFltrs.antiForgeryToken ], action: 'update' },
    'get /delete/:id'                     : { filters:[ csrfFltrs.antiForgeryToken ], action: 'delete' },
    'post /search'                        : { filters:[csrfFltrs.antiForgeryToken], action: '_search' },
    'post /destroy'                       : 'destroy'
  },

  index: function(request, response) {
    this.ecProductDao.getAll().success(function (products) {
      response.render('ecproduct/index', {'products': products});
    });
  },

  _index: function(request, response) {
    var self = this;
    var id = request.params.id || 1;
    var limit = parseInt(response.locals.options.numberOfLines) || 10;
    var offset = ( ( id * limit ) - limit ) || 0;
    self.ecOrderDao.getAll().success( function(allOrders){
      self.ecOrderDao.getAllByPage(offset, limit).success(function (orders) {
        response.render('ecorder/_index', {orders: orders, allOrders: allOrders, id: id});
      });
    });
  },

  _search: function(request, response){
    var self = this,
      id = request.params.id || 1,
      limit = parseInt(response.locals.options.numberOfLines) || 10,
      offset = ( ( id * limit ) - limit ) || 0,
      search = request.body.search || request.params.search;
    self.ecProductDao.getAllSearch(search).success( function(allProducts){
      self.ecProductDao.getAllSearchByPage(search, offset, limit).success(function (products) {
        response.render('ecproduct/_search', {products: products, allProducts: allProducts, id: id, search: search});
      });
    });
  },

  /**
     * Show category
     * GET
     */
  show: function(request, response) {
    var self = this;
    var id = request.params.id;
    this.ecCategoryDao.get(id).success(function (category) {
      if(!category){
        request.flash('danger', 'Aucune catégorie avec l\'id : ' + id);
        response.redirect(self.baseUrl+'/_index');
      }else{
        response.render('eccategory/show', {'category': category});
      }
    });
  },

  /**
     * Ajout d'un produit
     * GET
     */
  new: function (request, response) {
    var self = this;
    self.ecCustomerDao.getAll().success( function(customers){
      self.ecProductDao.getAll().success( function(products){
        response.render('ecorder/new', {customers: customers, products: products});
      });
    });
  },

  /**
     * Création d'un produit
     * POST
     */
  create: function (request, response) {
    var self = this;
    var orderProduct = request.body.orderProduct;
    this.ecOrderProductDao.save(orderProduct, function(modelError, orderProduct){
      if(modelError){
        request.flash('danger', self._parseValidationError(modelError));
        response.redirect('/ecorder/new');
      }else{
        request.flash('success', 'Commande sauvegardée');
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  /**
     * Edition d'un produit
     * GET
     */
  edit: function (request, response) {
    var self = this,
      id = request.params.id;
    self.ecCategoryDao.getAll().success( function(categories){
      self.ecProductDao.get(id).success(function (product) {
        response.render('ecproduct/edit', {'product': product, 'errors': null, categories: categories});
      });
    });
  },

  /**
     * Update category
     * POST
     */
  update: function (request, response) {
    var self = this;
    var properties = request.body.product;
    if (request.files) {
      self.ecProductDao.get(properties.id).success( function(product){
        properties.thumbnail = request.files.thumbnail.name || product.thumbnail;
        fs.unlinkSync('public/uploads/'+product.thumbnail);
      });
    }
    self.ecProductDao.update(properties, function (modelError, product) {
      if(product){
        if(modelError){
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/ecproduct/edit/' + properties.id);
        }else{
          request.flash('success', 'Produit mis à jour');
          response.redirect(self.baseUrl+'/_index');
        }
      }else{
        request.flash('danger', 'Aucun produit avec l\'id : ' + properties.id);
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  /**
     * Delete category
     * GET
     */
  delete: function (request, response) {
    var id = request.params.id;
    this.ecProductDao.get(id).success(function (product) {
      response.render('ecproduct/delete', { 'product': product });
    }).error(function (error) {
      request.flash('danger', 'Aucun produit avec l\'id : ' + id);
      response.redirect(self.baseUrl);
    });
  },

  /**
     * Destroy category
     * POST
     */
  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    this.ecProductDao.get(id).success( function(product){
      fs.unlinkSync('public/uploads/'+product.thumbnail);
      self.ecProductDao.delete(id, function (error) {
        request.flash('success', 'Produit supprimé');
        response.redirect(self.baseUrl+'/_index');
      });
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
