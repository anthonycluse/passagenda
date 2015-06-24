module.exports = function (db, Types) {
  var OfferStore = db.define('OfferStore', {
    name: {
      type: Types.STRING
    },
    logo: {
      type: Types.STRING
    },
    presentation: {
      type: Types.TEXT
    },
    mobilePhone: {
      type: Types.STRING
    },
    fixedLinePhone: {
      type: Types.STRING
    },
    fax: {
      type: Types.STRING
    },
    email: {
      type: Types.STRING
    },
    website: {
      type: Types.STRING
    },
    lat: {
      type: Types.FLOAT
    },
    lng: {
      type: Types.FLOAT
    },
    openingHours: {
      type: Types.TEXT
    }
  }, {
    classMethods:{
      associate: function (models) {
        OfferStore.hasMany(models.Offer);
      }
    }
  });
  return OfferStore;
};
