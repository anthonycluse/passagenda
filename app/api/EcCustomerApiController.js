var Controller    = require('microscope-web').Controller;
var EcCustomerDao    = require('../dao/EcCustomerDao');
var securityFltrs = require('../filters/security');
var moment = require('moment');
var async = require('async');

module.exports = Controller.extend({

  baseUrl: "/api/eccustomer",

  initialize: function () {
    this.ecCustomerDao = new EcCustomerDao();
  },

  filters:[
  securityFltrs.authorize
  ],

  routes: {
    'get /'                : 'getAll',
    'get /:id'             : 'get',
    'post /'               : 'post',
    'put /'                : 'put',
    'delete /:id'          : 'delete'
  },

  getAll: function(request, response) {
    if (request.query.search) {
      this.ecCustomerDao.getAllSearch(request.query.search).success(function (customers) {
        response.json(customers);
      });
    } else {
      this.ecCustomerDao.getAll().success(function (customers) {
        response.json(customers);
      });
    }
  },

  get: function (request, response) {
    var articleId = request.params.id;
    this.articleDao.get(articleId).success(function (article) {
      if(article){
        response.json(article);
      }else{
        response.send("No article with id : " + articleId);
      }
    });
  },

  post: function (request, response) {
    var self = this;
    var article = request.body;
    this.articleDao.save(article, function(modelError, article){
      if(modelError){
        response.json(modelError);
      }else{
        response.json(article);
      }
    });
  },

  put: function (request, response) {
    var properties = request.body;
    this.articleDao.update(properties, function (modelError, article) {
      if(article){ // article found
        if(modelError){ // but properties validation error
          response.json(modelError);
        }else{
          response.json(article);
        }
      }else{
        response.send(404);
      }
    });
  },

  delete: function (request, response) {
    var id = request.params.id;
    this.articleDao.delete(id, function (error) {
      if(error){
        response.json(404);
      }else{
        response.json('article deleted');
      }
    });
  }
});
