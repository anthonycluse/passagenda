/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var ArticleDao    = require('../dao/ArticleDao');
var securityFltrs = require('../filters/security');
var moment = require('moment');
var async = require('async');

/**
 * ArticleController class.
 */
module.exports = Controller.extend({

	baseUrl: "/api/article",

	initialize: function () {
		this.articleDao = new ArticleDao();
	},

	filters:[
		//securityFltrs.authorize
	],

	routes: {
		'get /'       : 'getAll',
		'get /:id'    : 'get',
		'post /'      : 'post',
		'put /'       : 'put',
		'delete /:id' : 'delete',
		'get /state/:state' : 'getAll'
	},

	/**
     * GET /api/article
     * Return all articles
     */
	getAll: function(request, response) {
		this.articleDao.getAll().success(function (articles) {
			response.json(articles);
		});
	},

	/**
     * GET /api/article/:id
     * Return article by id
     */
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

	/**
     * POST /api/article/
     * Add article
     */
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

	/**
     * PUT /api/article/
     * Update article
     */
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

	/**
     * DELETE /api/article/:id
     * Delete article by id
     */
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
