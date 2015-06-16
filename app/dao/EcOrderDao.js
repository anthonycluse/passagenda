var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

var EcOrderDao = function () {
  this.context = dbContext.entities;
};

_.extend(EcOrderDao.prototype, {

  getAll: function (callback) {
    return this.context.EcOrder.findAll({order: 'id desc', include: [{model: this.context.EcCustomer}]});
  },

  getAllSearch: function (search, callback) {
    return this.context.EcOrder.findAll({where: ['EcProduct.name like', '%'+search+'%'], order: 'id desc', include: [{model: this.context.EcCustomer}]});
  },

  get: function (id, callback) {
    return this.context.EcOrder.find({where: {id: id}, include: [{model: this.context.EcCustomer}]});
  },

  getAllByPage: function(offset, limit, callback){
    return this.context.EcOrder.findAll({offset: offset, limit: limit, order: 'id desc', include: [{model: this.context.EcCustomer}]});
  },

  getAllSearchByPage: function(search, offset, limit, callback){
    return this.context.EcOrder.findAll({where: ['EcProduct.name like', '%'+search+'%'], offset: offset, limit: limit, order: 'id desc', include: [{ model: this.context.EcCustomer}]});
  },

  getLastTen: function(callback){
    return this.context.EcOrder.findAll({order: 'id desc', limit: 10, include: [{model: this.context.EcCustomer}]});
  },

  save: function(properties, callback){
    this.context.EcOrder.create(properties)
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
    this.context.EcOrder.find(id).success(function (product) {
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

module.exports = EcOrderDao;