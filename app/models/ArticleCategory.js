module.exports = function (db, Types) {
  var ArticleCategory = db.define('ArticleCategory', {
    name: {
      type: Types.STRING,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Vous devez saisir un nom entre 1 et 50 caractères.'
        }
      }
    },
  }, {
    classMethods:{
      associate: function (models) {
        ArticleCategory.hasMany(models.Article);
      }
    }
  });
  return ArticleCategory;
};
