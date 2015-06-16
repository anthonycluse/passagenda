var dbContext   = require('./../../db/DbContext');
var _           = require('lodash');

var ArticleDao = function () {
  this.context = dbContext.entities;
};

_.extend(ArticleDao.prototype, {

  // on récupère tous les articles pour l'admin en ligne et hors ligne
  // trié et on rajoute la limit pour les pages
  // step over the first "offset" elements, and take "limit"
  getAllByPage: function(offset, limit, callback){
    return this.context.Article.findAll({offset: offset, limit: limit, order: 'id desc', include: [{ model: this.context.ArticleCategory}]});
  },

  // maintenant ceux en ligne
  getAllOnlineByPage: function(offset, limit, callback){
    return this.context.Article.findAll({where: {state: 1}, offset: offset, limit: limit, order: 'id desc', include: [{ model: this.context.ArticleCategory}]});
  },

  // on récupère tous les articles pour l'admin, en ligne et hors-ligne et trié
  getAll: function (callback) {
    return this.context.Article.findAll({order: 'id desc', include: [{ model: this.context.ArticleCategory}]});
  },

  // on récupère les 10 premiers articles trié
  getFirstTenOnline: function(){
    return this.context.Article.findAll({where: {state: 1}, limit: 10, order: 'id desc', include: [{ model: this.context.ArticleCategory}]});
  },

  // on récupère tous les articles en ligne trié
  getAllOnline: function (callback) {
    return this.context.Article.findAll({where: {state: 1}, order: 'id desc',include: [{ model: this.context.ArticleCategory}]});
  },

  // on récupère tous les articles hors-ligne trié
  getAllOffline: function (callback) {
    return this.context.Article.findAll({where: {state: 0}, order: 'id desc',include: [{ model: this.context.ArticleCategory}]});
  },

  get: function (id, callback) {
    return this.context.Article.find(id);
  },

  save: function(properties, callback){
    this.context.Article.create(properties)
    .success(function (article) {
      callback(null, article);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  update: function (properties, callback) {
    this.get(properties.id).success(function (article) {
      if(article){
        article.updateAttributes(properties).success(function (article) {
          callback(null, article);
        }).error(function (error) {
          callback(error, article);
        });
      }else{
        callback('Aucun article avec l\'id :' + properties.id, null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.Article.find(id).success(function (article) {
      if(article){
        article.destroy().success(callback);
      }
      else{
        callback('Aucun article avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = ArticleDao;
