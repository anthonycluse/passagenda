/**
 * Imports
 */
var path          = require('path');
var dbConnection  = require('./dbConnection');
var BaseDbContext = require('./libs/BaseDbContext');
var appModels  = path.join(__dirname + './../app/models/');

/**
 * DbContext class
 * Extend BaseDbContext
 */
var DbContext = BaseDbContext.extend({
    db: dbConnection,
    modelsFolder: [
        appModels
    ]
});

var dbContext = new DbContext();

module.exports = dbContext;