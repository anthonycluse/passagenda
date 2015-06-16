module.exports = function (db, Types) {
  var EventCategory = db.define('EventCategory', {
    name: {
      type: Types.STRING,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Vous devez saisir un nom entre 1 et 50 caractères.'
        }
      }
    },
    color: {
      type: Types.STRING
    }
  }, {
    classMethods:{
      associate: function (models) {
        EventCategory.hasMany(models.Event);
      }
    }
  });
  return EventCategory;
};
