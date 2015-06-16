module.exports = function (db, Types) {
    var Event = db.define('Event', {
        title: {
            type: Types.STRING,
            validate: {
                len: {
                    args: [1, 50],
                    msg: 'Vous devez saisir un titre entre 1 et 50 caractères.'
                }
            }
        },
        start: {
            type: Types.DATE
        },
        end: {
            type: Types.DATE
        }
    }, {
        classMethods:{
            associate: function (models) {
                Event.belongsTo(models.EventCategory);
            }
        }
    });
    return Event;
};
