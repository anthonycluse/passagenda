module.exports = function (db, Types) {
  var Article = db.define('Article', {
    title: {
      type: Types.STRING,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Vous devez saisir un titre entre 1 et 50 caractères.'
        }
      }
    },
    content: {
      type: Types.TEXT,
      validate: {
        len: {
          args: [5, 10000000],
          msg: 'Vous devez saisir un texte entre 5 et 1000 caractères.'
        }
      }
    },
    state: {
      type: Types.BOOLEAN,
      defaultValue: false,
      set: function(value) {
        value === '1' ? value = true : value = false;
        this.setDataValue('state', value);
      }
    },
    thumbnail: {
      type: Types.STRING
    },
    seo_title: {
      type: Types.STRING
    },
    seo_url: {
      type: Types.STRING
    },
    seo_share: {
      type: Types.BOOLEAN,
      defaultValue: false,
      set: function(value) {
        value === '1' ? value = true : value = false;
        this.setDataValue('seo_share', value);
      }
    }
  },{
    classMethods:{
      associate: function (models) {
        Article.belongsTo(models.ArticleCategory);
      }
    }
  });
  return Article;
};
