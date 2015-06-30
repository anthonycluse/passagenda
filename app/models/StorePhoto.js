module.exports = function (db, Types) {
  var StorePhoto = db.define('StorePhoto', {
    file: {
      type: Types.STRING
    },
  },{
    classMethods:{
      associate: function (models) {
        StorePhoto.belongsTo(models.OfferStore);
      }
    }
  });
  return StorePhoto;
};
