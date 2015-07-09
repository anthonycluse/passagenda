module.exports = function (db, Types) {
  var StoreAddress = db.define('StoreAddress', {
    address: {
      type: Types.STRING
    },
    cp: {
      type: Types.STRING
    },
    city: {
      type: Types.STRING
    },
    complementary_addresss: {
      type: Types.STRING
    },
    lat: {
      type: Types.STRING
    },
    lng: {
      type: Types.STRING
    }
  },{
    classMethods:{
      associate: function (models) {
        StoreAddress.belongsTo(models.OfferStore);
      }
    }
  });
  return StoreAddress;
};
