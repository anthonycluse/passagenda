module.exports = function (db, Types) {
  var EcCustomer = db.define('EcCustomer', {
    email: {
      type: Types.STRING,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Types.STRING
    },
    firstname: {
      type: Types.STRING
    },
    lastname: {
      type: Types.STRING
    },
    address: {
      type: Types.STRING
    },
    complementary_address: {
      type: Types.STRING
    },
    postal_code: {
      type: Types.STRING
    },
    city: {
      type: Types.STRING
    },
    country: {
      type: Types.STRING
    }
  },{
    classMethods:{
      associate: function (models) {
        EcCustomer.hasMany(models.EcOrder);
      }
    }
  });
  return EcCustomer;
}
