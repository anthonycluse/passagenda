module.exports = function (db, Types) {
  var EcOrderProduct = db.define('EcOrderProduct', {
    quantity: {
      type: Types.INTEGER
    },
  },{
    classMethods:{
      associate: function (models) {
        EcOrderProduct.belongsTo(models.EcOrder);
        EcOrderProduct.belongsTo(models.EcProduct);
      }
    }
  });
  return EcOrderProduct;
};
