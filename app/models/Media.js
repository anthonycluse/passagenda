module.exports = function (db, Types) {
  var Media = db.define('Media', {
    title: {
      type: Types.STRING,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Vous devez saisir un titre entre 1 et 50 caractères.'
        }
      }
    },
    file: {
      type: Types.STRING
    },
  },{
    classMethods:{
      associate: function (models) {}
    }
  });
  return Media;
};
