/**
 * Imports
 */
var engine = require('ejs-locals'),
  fs = require('fs'),
  cheerio = require('cheerio');

/**
 * EJS Template Engine Provider
 */
module.exports = function templateEngineProvider (app) {
  app.set('views', app.get('viewsFolder'));
  app.set('view engine', 'ejs');
  app.set('layout', 'layout');
  app.engine('ejs', engine);
  app.locals._layoutFile = true;
  // permet de renvoyer un texte d'un article avec des balises HTML
  app.locals.formatText = function(text, start, end) {
    var start = start | 0;
    var end = end | 20;
    $ = cheerio.load(text);
    return $('p').text().substr(start, end);
  };
};
