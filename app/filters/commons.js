var counter = 0;

/**
 * visit counter filter
 */
exports.counter = function(request, response, next) {
	counter++;
	console.log('visit counter: ' + counter);
	//request.counter = counter;
  next();
};