module.exports = function (db, Types) {
  var Offer = db.define('Offer', {
    startDate: {
      type: Types.DATE
    },
    endDate: {
      type: Types.DATE
    },
    conditions: {
      type: Types.TEXT
    },
    description: {
      type: Types.TEXT
    }
  },{
    classMethods:{
      associate: function (models) {
        Offer.belongsTo(models.OfferType);
        Offer.belongsTo(models.OfferCategory);
        Offer.belongsTo(models.OfferStore);
      }
    }
  });
  return Offer;
};
