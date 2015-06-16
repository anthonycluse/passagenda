/**
 * Imports
 */
var csrf = require('csurf');

/**
 * init express.csrf filter.
 * 
 * @param  {request}   request
 * @param  {response}   response
 * @param  {Function} next
 */
exports.csrf = function (request, response, next) {
	(csrf())(request, response, next);
};

/**
 * antiforgerytoken filter
 * Deliver antiforgery token in http response based on _csrf session key.
 * @param  {request} request
 * @param  {response} response
 * @param  {Function} next
 */
exports.antiForgeryToken = function (request, response, next) {
	response.locals.csrfToken = request.csrfToken();
	next();
};