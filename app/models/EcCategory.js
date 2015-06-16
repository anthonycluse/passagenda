module.exports = function (db, Types) {
  var EcCategory = db.define('EcCategory', {
    name: {
      type: Types.STRING,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Vous devez saisir un nom entre 1 et 50 caractères.'
        }
      }
    },
    // 0 : premier rang
    // 1 : deuxième rang
    // 3 : trosième rand, ect...
    position: {
      type: Types.INTEGER
    }
  }, {
    classMethods:{
      associate: function (models) {
        EcCategory.hasMany(models.EcProduct);
        EcCategory.hasMany(EcCategory, {onDelete: 'cascade'});
        EcCategory.belongsTo(EcCategory);
      }
    }
  });
  return EcCategory;
};
