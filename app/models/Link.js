module.exports = function (db, Types) {
  var Link = db.define('Link', {
    name: {
      type: Types.STRING,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Vous devez saisir un titre entre 1 et 50 caractères.'
        }
      }
    },
    // 0 : home
    // 1 : menu
    // 2 : sous menu
    type: {
      type: Types.INTEGER
    },
    // page_id
    // article_id
    // url_externe
    pointer: {
      type: Types.STRING
    },
    // position du lien par rapport au autres liens
    // 0 = > premier
    // 1 = > deuxième, ect...
    position: {
      type: Types.INTEGER
    }
  },{
    classMethods:{
      associate: function (models) {
        Link.hasMany(models.Link);
      }
    }
  });
  return Link;
};
