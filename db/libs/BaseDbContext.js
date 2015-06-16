/**
 * Imports
 */
var path = require('path');
var fs   = require('fs');
var _    = require('lodash');

/**
 * BaseDbContext class
 * @param  {Object} options
 */
var BaseDbContext = module.exports = function(options) {
    options || (options = {});
    this.entities = {};
    this._loadModels();
    this.initialize.apply(this, arguments);
}

_.extend(BaseDbContext.prototype, {

	initialize: function () {},

	modelsFolder: [],

	_loadModels: function () {
		if(!this.db) { return; }
		var self = this;
		
		this.modelsFolder.forEach(function (folderpath) {
			fs.readdirSync(folderpath).forEach(function(file) {
				var modelName = file.split('.')[0];
			    var model = self.db.import(path.join(folderpath, file));
			    self.entities[modelName] = model;
			});
			 
			Object.keys(self.entities).forEach(function(modelName) {
				if ('associate' in self.entities[modelName]) {
					self.entities[modelName].associate(self.entities);
				}
			});
		});
	},

	sync: function () {
		return this.db.sync();
	},

	drop: function () {
		return this.db.drop();
	}
});

/**
 * JavaScript extend function
 */
function extend(protoProps, staticProps) {
    var parent = this;
    var child;

    if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
    } else {
        child = function() {
            return parent.apply(this, arguments);
        };
    }

    _.extend(child, parent, staticProps);

    child.prototype = Object.create(parent.prototype, {
        constructor: {
            value: child,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    if (protoProps) _.extend(child.prototype, protoProps);

    child.__super__ = parent.prototype;

    return child;
};

BaseDbContext.extend = extend;

module.exports = BaseDbContext;