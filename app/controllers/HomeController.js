


/**
 * Imports.
 */
var Controller       = require('microscope-web').Controller;
var commonsFltrs     = require('../filters/commons');
var securityFltrs    = require('../filters/security');
var csrfFltrs        = require('../filters/csrf');
var moment           = require('moment');
var UserDao          = require('../dao/UserDao');
var LinkDao          = require('../dao/LinkDao');
var PageDao          = require('../dao/PageDao');
var fs               = require('fs');
var nodemailer       = require('nodemailer');
var requestModule    = require('request');

/**
 * HomeController class.
 */
module.exports = HomeController = Controller.extend({

  baseUrl: "/home",

  initialize: function () {
    this.userDao = new UserDao();
    this.linkDao = new LinkDao();
    this.pageDao = new PageDao();
  },

  filters: [
    csrfFltrs.csrf
  ],

  routes: {
    'get /'                  : { action: 'index', ignoreBaseUrl: true },
    'get /about'             : { action: 'about' },
    'get /sockets'           : { action: 'sockets', filters:[securityFltrs.authorizeAdmin]},
    'get /glovebox'          : { action: 'glovebox', ignoreBaseUrl: true, filters:[securityFltrs.authorizeAdmin] },
    'get /contact'           : { action: 'contact', ignoreBaseUrl: true, filters: [csrfFltrs.antiForgeryToken] },
    'post /contact/send'     : { action: 'send', ignoreBaseUrl: true },
    'get /mentions-legales'  : { action: 'mentions', ignoreBaseUrl: true }
  },

  mentions: function(request, response) {
    this.linkDao.getAllByOrder().success( function(links){
      response.render('themes/'+response.locals.options.theme+'/mentions', {links: links, seoTitle: response.locals.options.modules.contact.title});
    });
  },

  contact: function(request, response){
    this.linkDao.getAllByOrder().success( function(links){
      response.render('themes/'+response.locals.options.theme+'/contact', {links: links, seoTitle: response.locals.options.modules.contact.title});
    });
  },

  send: function(request, response){
    var contact = request.body.contact;
    var to = response.locals.options.email;
    var transporter = nodemailer.createTransport();
    transporter.sendMail({
      from: contact.email,
      to: to,
      subject: contact.subject,
      text: contact.message
    });
    request.flash('success', 'Votre e-mail a bien été envoyé');
    response.redirect('/contact');
  },

  glovebox: function(request, response){
    var self = this,
        date = moment(),
        month,
        day,
        weatherUrl = 'http://api.worldweatheronline.com/free/v2/weather.ashx?q='+response.locals.options.address+', '+response.locals.options.cp+' '+response.locals.options.city+'&format=json&num_of_days=5&key=6309de41c946756ed51fda0ff88d8&lang=fr';

    switch(date.month()+1){
      case 1:
        month = 'janvier';
        break;
      case 2:
        month = 'février';
        break;
      case 3:
        month = 'mars';
        break;
      case 4:
        month = 'avril';
        break;
      case 5:
        month = 'mai';
        break;
      case 6:
        month = 'juin';
        break;
      case 7:
        month = 'juillet';
        break;
      case 8:
        month = 'août';
        break;
      case 9:
        month = 'septembre';
        break;
      case 10:
        month = 'octobre';
        break;
      case 11:
        month = 'novembre';
        break;
      case 12:
        month = 'décembre';
        break;
    }

    switch(date.day()){
      case 1:
        day = 'lundi';
        break;
      case 2:
        day = 'mardi';
        break;
      case 3:
        day = 'mercredi';
        break;
      case 4:
        day = 'jeudi';
        break;
      case 5:
        day = 'vendredi';
        break;
      case 6:
        day = 'samedi';
        break;
      case 7:
        day = 'dimanche';
        break;
    }

    var year = date.year();
    var likeDay = date.date();
    var formatedDay = ( likeDay > 9 ) ? likeDay : '0'+likeDay;
    var likeMonth = date.month()+1;
    var formatedMonth = ( likeMonth > 9 ) ? likeMonth : '0'+likeMonth;
    var like = year+'-'+formatedMonth+'-'+formatedDay;

    self.pageDao.getAll().success( function(pages){
      self.linkDao.getAll().success( function(links){
        requestModule(weatherUrl, function(error, responseModule, body) {
          response.render('home/glovebox', {
            date: moment(),
            monthName: month,
            dayName: day,
            dayNumber: formatedDay,
            pages: pages,
            links: links,
            weather: body
          });
        });
      });
    });
  },

  index: function(request, response) {
    var self = this;

    fs.readFile('configs/options.json', 'utf8', function (err, data) {
      if (err) throw err;
      var options = JSON.parse(data);
      if (options.pack === '') {
        response.redirect('installation');
      } else {
        self.linkDao.getAllByOrder().success( function(links){
          self.linkDao.getHome().success( function(link){
            if( link.length ){
              var reg = /[0-9]+/g;
              var pageId = parseInt(link[0].pointer.match(reg)[0]);
              self.pageDao.get(pageId).success( function(page){
                response.render('themes/'+response.locals.options.theme+'/index', {links: links, page: page});
              });
            }else{
              request.flash('danger', 'Vous n\'avez pas encore de page d\'accueil, n\'attendez pas avant de la créer !');
              response.render('themes/'+response.locals.options.theme+'/index', {links: links});
            }
          });
        });
      }
    });
  },

  sockets: function (request, response) {
    response.render('home/socket');
  }

});
