module.exports = function (db, Types) {
  var EcOrder = db.define('EcOrder', {}, {
    classMethods:{
      associate: function (models) {
        EcOrder.belongsTo(models.EcCustomer);
        EcOrder.hasMany(models.EcOrderProduct);
      }
    }
  });
  return EcOrder;
};