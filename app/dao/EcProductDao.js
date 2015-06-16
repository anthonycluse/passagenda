var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

var EcPdocuctDao = function () {
  this.context = dbContext.entities;
};

_.extend(EcPdocuctDao.prototype, {

  getAll: function (callback) {
    return this.context.EcProduct.findAll({order: 'id desc', include: [{model: this.context.EcCategory}]});
  },

  getAllSearch: function (search, callback) {
    return this.context.EcProduct.findAll({where: ['EcCategory.name like ? or EcProduct.name like ? or reference like ? or description like ?', '%'+search+'%', '%'+search+'%', '%'+search+'%', '%'+search+'%'], order: 'id desc', include: [{model: this.context.EcCategory}]});
  },

  get: function (id, callback) {
    return this.context.EcProduct.find({where: {id: id}, include: [{model: this.context.EcCategory}]});
  },

  getAllByPage: function(offset, limit, callback){
    return this.context.EcProduct.findAll({offset: offset, limit: limit, order: 'id desc', include: [{ model: this.context.EcCategory}]});
  },

  getAllSearchByPage: function(search, offset, limit, callback){
    return this.context.EcProduct.findAll({where: ['EcCategory.name like ? or EcProduct.name like ? or reference like ? or description like ?', '%'+search+'%', '%'+search+'%', '%'+search+'%', '%'+search+'%'], offset: offset, limit: limit, order: 'id desc', include: [{ model: this.context.EcCategory}]});
  },

  getLastTen: function(callback){
    return this.context.EcProduct.findAll({order: 'id desc', limit: 10, include: [{model: this.context.EcCategory}]});
  },

  getAllByCategory: function(id, callback){
    return this.context.EcProduct.findAll({order: 'id desc', where: {EcCategoryId: id}});
  },

  save: function(properties, callback){
    this.context.EcProduct.create(properties)
    .success(function (product) {
      callback(null, product);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  update: function (properties, callback) {
    this.get(properties.id).success(function (product) {
      if(product){
        product.updateAttributes(properties).success(function (product) {
          callback(null, product);
        }).error(function (error) {
          callback(error, product);
        });
      }else{
        callback('Aucune catégorie avec l\'id :' + properties.id, null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.EcProduct.find(id).success(function (product) {
      if(product){
        product.destroy().success(callback);
      }
      else{
        callback('Aucun produit avec l\'id :' + id);
      }
    })
    .error(callback);
  }
});

module.exports = EcPdocuctDao;