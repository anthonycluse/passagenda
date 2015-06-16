module.exports = function (db, Types) {
  var ProjectPhoto = db.define('ProjectPhoto', {
    file: {
      type: Types.STRING
    },
  },{
    classMethods:{
      associate: function (models) {
        ProjectPhoto.belongsTo(models.Project);
      }
    }
  });
  return ProjectPhoto;
};
