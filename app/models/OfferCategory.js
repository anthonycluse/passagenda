module.exports = function (db, Types) {
  var OfferCategory = db.define('OfferCategory', {
    name: {
      type: Types.STRING
    },
  }, {
    classMethods:{
      associate: function (models) {
        OfferCategory.hasMany(models.Offer);
      }
    }
  });
  return OfferCategory;
};
