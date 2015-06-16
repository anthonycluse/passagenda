/**
 * Imports
 */
var url     = require('url');
var _       = require('lodash');
var session = require('express-session');
var flash   = require('connect-flash');
var multer  = require('multer');
var fs      = require('fs');

/**
 * defaults middleware like uploads, session and flash request
 * @param  {express} app
 */
exports.defaults = function (app) {
  app.use(session({ resave: true, saveUninitialized: true, secret: 'gestiaweb' }));
  app.use(multer({
    dest: './public/uploads/',
    limits: {
      fileSize: 5242880 // 7340032 octets = 7 mo -- = 819200 octets = 800 ko --- 102400 octets = 100 ko --- 5242880 octets = 5 mo
    },
    onFileSizeLimit: function (file) {
      console.log('Failed: ', file.originalname);
      fs.unlink('./'+file.path);
    },
    onFileUploadComplete: function(file){
      console.log(file, url);
    }
  }));
};

/**
 * Expose some objects in response locals.
 * @param  {http request}   request
 * @param  {http response}   response
 * @param  {Function} next callback
 */
exports.locals = function(app){
  app.use(function(request, response, next){
    response.locals.megaURL = request.protocol + '://' + request.get('host') + request.originalUrl;
    response.locals.mediumURL = request.protocol + '://' + request.get('host');
    response.locals.options = JSON.parse(fs.readFileSync('./configs/options.json', 'utf8'));
    response.locals.socials = JSON.parse(fs.readFileSync('./configs/socials.json', 'utf8'));
    response.locals.themeOptions = JSON.parse(fs.readFileSync('./configs/themes/'+response.locals.options.theme+'.json', 'utf8'));
    response.locals.request = request;
    response.locals.path = url.parse(request.url).pathname;
    response.locals._ = _;
    response.locals.formatDate = function(datetime) {
      var day = (datetime.getDate() <= 9 ) ? '0' + datetime.getDate() : datetime.getDate();
      var month = ((datetime.getMonth() + 1) <= 9) ? '0' + (datetime.getMonth() + 1) : (datetime.getMonth() + 1);
      var year = datetime.getFullYear();
      return day+'/'+month+'/'+year;
    };
    // calcul la taille d'un fichier en bytes
    response.locals.getFileSize = function(filePath) {
      var stats = fs.statSync(filePath);
      return Math.ceil(stats.size/1000);
    };
    next();
  });
};

/**
 * Set flash response middleware
 * @param  {express} app
 */
exports.flash = function (app) {
  app.use(flash());
  app.use(function (request, response, next) {
    response.locals.flash = {
      info    : request.flash('info'),
      success : request.flash('success'),
      warning : request.flash('warning'),
      danger  : request.flash('danger')
    };
    next();
  });
};
