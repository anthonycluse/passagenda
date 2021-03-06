/**
* Dependencies.
*/
var Sequelize = require("sequelize");
var dbConfig = require("../configs/database.json");

/**
 * connect to databse
 */
console.log('... connecting to database ...');

var db = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
	host: dbConfig.host,
	port: dbConfig.port,
	dialect: dbConfig.dialect,
	storage: dbConfig.storage
});

module.exports = db;