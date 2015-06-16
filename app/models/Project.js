module.exports = function (db, Types) {
  var Project = db.define('Project', {
    title: {
      type: Types.STRING,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Vous devez saisir un titre entre 1 et 50 caractères.'
        }
      }
    },
    author: {
      type: Types.STRING,
      validate: {
        len: {
          args: [1, 50],
          msg: 'Vous devez saisir un auteur entre 1 et 50 caractères.'
        }
      }
    },
    description: {
      type: Types.TEXT,
      validate: {
        len: {
          args: [5, 1000],
          msg: 'Vous devez saisir une description entre 5 et 1000 caractères.'
        }
      }
    },
    place: {
      type: Types.STRING
    },
    thumbnail: {
      type: Types.STRING
    },
    link: {
      type: Types.STRING
    },
    state: {
      type: Types.BOOLEAN,
      defaultValue: false,
      set: function(value) {
        value == '1' ? value = true : value = false;
        this.setDataValue('state', value);
      }
    }

  }, {
    classMethods:{
      associate: function (models) {
        Project.belongsTo(models.ProjectCategory);
        Project.hasMany(models.ProjectPhoto);
      }
    }
  });
  return Project;
};
