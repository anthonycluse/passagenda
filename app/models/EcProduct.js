module.exports = function (db, Types) {
  var EcProduct = db.define('EcProduct', {
    name: {
      type: Types.STRING
    },
    reference: {
      type: Types.STRING
    },
    thumbnail: {
      type: Types.STRING
    },
    description: {
      type: Types.TEXT
    },
    price: {
      type: Types.FLOAT
    },
    quantity: {
      type: Types.INTEGER
    }
  },{
    classMethods:{
      associate: function (models) {
        EcProduct.belongsTo(models.EcCategory);
        EcProduct.hasMany(models.EcOrderProduct);
      }
    }
  });
  return EcProduct;
};