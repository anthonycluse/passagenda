var dbContext = require('./../../db/DbContext');
var _ = require('lodash');

var EcOrderProductDao = function () {
  this.context = dbContext.entities;
};

_.extend(EcOrderProductDao.prototype, {

  getAll: function (callback) {
    return this.context.EcOrderProduct.findAll({order: 'id desc', include: [{model: this.context.EcOrder}, {model: this.context.EcProduct}]});
  },

  get: function (id, callback) {
    return this.context.EcOrderProduct.find({where: {id: id}, include: [{model: this.context.EcCustomer}]});
  },

  getAllByOrder: function(id, callback){
    return this.context.EcOrderProduct.findAll({where: {EcOrderId: id}, order: 'id desc', include: [{model: this.context.EcOrder}, {model: this.context.EcProduct}]});
  },

  save: function(properties, callback){
    this.context.EcOrderProduct.create(properties)
    .success(function (orderProduct) {
      callback(null, orderProduct);
    })
    .error(function (error) {
      callback(error, null);
    });
  },

  update: function (properties, callback) {
    this.get(properties.id).success(function (orderProduct) {
      if(orderProduct){
        orderProduct.updateAttributes(properties).success(function (orderProduct) {
          callback(null, orderProduct);
        }).error(function (error) {
          callback(error, orderProduct);
        });
      }else{
        callback('Aucune catégorie avec l\'id :' + properties.id, null);
      }
    });
  },

  delete: function (id, callback) {
    this.context.EcOrderProduct.find(id).success(function (product) {
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

module.exports = EcOrderProductDao;