module.exports = function (db, Types) {
  var ProjectCategory = db.define('ProjectCategory', {
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
        ProjectCategory.hasMany(models.Project);
      }
    }
  });
  return ProjectCategory;
};
