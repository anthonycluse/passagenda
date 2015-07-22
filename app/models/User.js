module.exports = function (db, Types) {
  var User = db.define('User', {
    username: {
      type: Types.STRING,
      validate: {
        len: {
          args: [2, 50],
          msg: 'Vous devez saisir un nom utilisateur entre 2 et 50 caractères.'
        }
      }
    },
    email: {
      type: Types.STRING,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Types.STRING
    },
    firstname: {
      type: Types.STRING
    },
    lastname: {
      type: Types.STRING
    },
    address: {
      type: Types.STRING
    },
    postal_code: {
      type: Types.STRING
    },
    city: {
      type: Types.STRING
    },
    birth: {
      type: Types.STRING
    },
    right: {
      type: Types.INTEGER,
      defaultValue: 3
    },
    pack: {
      type: Types.STRING
    },
    provider:{
      type: Types.STRING
    },
    openId: {
      type: Types.STRING
    }
  },{
    classMethods:{
      associate: function (models) {}
    }
  });
  return User;
}
