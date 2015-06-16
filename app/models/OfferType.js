module.exports = function (db, Types) {
  var OfferType = db.define('OfferType', {
    name: {
      type: Types.STRING
    }
  },{
    classMethods:{
      associate: function (models) {
        OfferType.hasMany(models.Offer);
      }
    }
  });
  return OfferType;
};
