/**
 * Handle 404
 * @param  {http request}   req
 * @param  {http response}   res
 */
function notFound(req, res) {
	res.status(404);
  
	// respond with html page
	if (req.accepts('html')) {
		res.render('shared/404', {title: '404: File Not Found', url: req.url});
		return;
	}

	// respond with json
	if (req.accepts('json')) {
		res.send({ error: '404: File Not Found' });
		return;
	}

    // default to plain-text. send()
  	res.type('txt').send('404: File Not Found');
};

/**
 * Handle 500
 * @param  {http request}   req
 * @param  {http response}   res
 * @param  {Function} next callback
 */
function internalServerError(error, req, res, next) {
	var status = error.status || 500;
  	res.status(status);
  	var stack = req.app.get('env') === 'dev' ? error.stack : '';
  	var model = {
    	title: status+' : Internal Server Error',
    	error: error.message,
    	stack: stack
    }
    res.render('shared/500', model);
};

module.exports = function errorsHandlers (app) {
	app.use(notFound);
	app.use(internalServerError);
}