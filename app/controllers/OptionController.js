/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var commonFltrs   = require('../filters/commons');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var _             = require('lodash');
var fs            = require('fs');
var path          = require('path');
var shell         = require('shelljs');

/**
 * OptionController class.
 */
module.exports = OptionController = Controller.extend({

  baseUrl: "/option",

  initialize: function () {
  },

  filters: [
    securityFltrs.authorize,
    csrfFltrs.csrf
  ],

  routes: {
    'get /'                                  : 'index',
    'get /show/:id'                          : 'show',
    'get /new'                               : { filters:[ csrfFltrs.antiForgeryToken ], action: 'new' },
    'post /create'                           : 'create',
    // get edit options
    'get /edit'                              : { filters:[ csrfFltrs.antiForgeryToken ], action: 'edit' },
    'get /contact/edit'                      : { filters:[ csrfFltrs.antiForgeryToken ], action: 'editContact' },
    'get /modules/edit'                       : { filters:[ csrfFltrs.antiForgeryToken ], action: 'editModules' },
    'get /seo/edit'                          : { filters:[ csrfFltrs.antiForgeryToken ], action: 'editSeo' },
    'get /smo/edit'                          : { filters:[ csrfFltrs.antiForgeryToken ], action: 'editSmo' },
    'get /robots/edit'                       : { filters:[ csrfFltrs.antiForgeryToken ], action: 'editRobots' },
    'get /theme/edit'                        : { filters:[ csrfFltrs.antiForgeryToken ], action: 'editTheme' },
    'get /css/edit'                          : { filters:[ csrfFltrs.antiForgeryToken ], action: 'editCss' },
    'get /logo/edit'                         : { filters:[ csrfFltrs.antiForgeryToken ], action: 'editLogo' },
    'get /logo/destroy'                      : { filters:[ csrfFltrs.antiForgeryToken ], action: 'destroyLogo' },
    'get /file/edit'                         : { filters:[ csrfFltrs.antiForgeryToken ], action: 'editFileModulePassword' },
    'get /views/edit'                        : { action: 'editViews' },
    'get /view/edit'                         : { filters:[ csrfFltrs.antiForgeryToken ], action: 'editView' },
    'get /update/edit'                       : { filters:[ csrfFltrs.antiForgeryToken ], action: 'editUpdate' },
    'get /module/edit/:module'               : { filters:[ csrfFltrs.antiForgeryToken ], action: 'editModule' },
    // post update option
    'post /update'                           : { filters:[ csrfFltrs.antiForgeryToken ], action: 'update' },
    'get /delete/:id'                        : { filters:[ csrfFltrs.antiForgeryToken ], action: 'delete' },
    'post /destroy'                          : 'destroy',
    'post /contact/update'                   : { filters:[ csrfFltrs.antiForgeryToken ], action: 'updateContact' },
    'post /seo/update'                       : { filters:[ csrfFltrs.antiForgeryToken ], action: 'updateSeo' },
    'post /smo/update'                       : { filters:[ csrfFltrs.antiForgeryToken ], action: 'updateSmo' },
    'post /robots/update'                    : { filters:[ csrfFltrs.antiForgeryToken ], action: 'updateRobots' },
    'get /module/update/:module/:action'     : { filters:[ csrfFltrs.antiForgeryToken ], action: 'updateModule' },
    'post /css/update'                       : { filters:[ csrfFltrs.antiForgeryToken ], action: 'updateCss' },
    'get /theme/update/:theme'               : { filters:[ csrfFltrs.antiForgeryToken ], action: 'updateTheme' },
    'post /logo/update'                      : { filters:[ csrfFltrs.antiForgeryToken ], action: 'updateLogo' },
    'post /file/update'                      : { filters:[ csrfFltrs.antiForgeryToken ], action: 'updateFileModulePassword' },
    'post /view/update'                      : { filters:[ csrfFltrs.antiForgeryToken ], action: 'updateView' },
    'post /module/update'                    : { filters:[ csrfFltrs.antiForgeryToken ], action: 'updateModule' }
  },

  index: function(request, response) {
    this.optionDao.getAll().success(function (options) {
      response.render('option/index', {'options': options});
    });
  },

  show: function(request, response) {
    var self = this;
    var id = request.params.id;
    self.optionDao.get(id).success(function (option) {
      if(!option){
        request.flash('danger', 'Aucune option avec l\'id : ' + id);
        response.redirect(self.baseUrl);
      }else{
        response.render('option/show', {'option': option});
      }
    });
  },

  new: function (request, response) {
    response.render('option/new');
  },

  create: function (request, response) {
    var self = this;
    var option = request.body.option;
    this.optionDao.save(option, function(modelError, option){
      if(modelError){
        request.flash('danger', self._parseValidationError(modelError));
        response.redirect('/option/new');
      }else{
        request.flash('success', 'Option sauvegardée.');
        response.redirect(self.baseUrl);
      }
    });
  },

  edit: function (request, response) {
    response.render('option/edit');
  },

  editContact: function (request, response) {
    response.render('option/editContact');
  },

  editModules: function (request, response) {
    response.render('option/editModules');
  },

  editModule: function (request, response) {
    var title = response.locals.options.modules[request.params.module].title;
    response.render('option/editModule', {action: 3, module: request.params.module, title: title});
  },

  editSeo: function (request, response) {
    response.render('option/editSeo');
  },

  editSmo: function (request, response) {
    response.render('option/editSmo');
  },

  editRobots: function (request, response) {
    fs.readFile('./public/robots.txt', 'utf8', function (err, data) {
      if (err) throw err;
      response.render('option/editRobots', {robots: data});
    });
  },

  editTheme: function (request, response) {
    response.render('option/editTheme');
  },

  editCss: function (request, response) {
    var theme = response.locals.options.theme;
    fs.readFile('./public/stylesheets/themes/'+theme+'.css', 'utf8', function (err, data) {
      if (err) throw err;
      response.render('option/editCss', {css: data});
    });
  },

  editLogo: function (request, response) {
    response.render('option/editLogo');
  },

  editUpdate: function (request, response) {
    shell.exec('pm2 reload 27', function(code, output) {
      console.log('Exit code:', code);
      console.log('Program output:', output);
    });
    response.redirect('/');
  },

  destroyLogo: function (request, response) {
    var self = this;
    var optionFile = './configs/options.json';
    fs.readFile(optionFile, 'utf8', function (err, data) {
      if (err) throw err;
      var options = JSON.parse(data);
      fs.unlinkSync('public/uploads/'+options.logo);
      options.logo = '';
      fs.writeFile(optionFile, JSON.stringify(options, null, 4), function(err) {
        if(err) {
          request.flash('danger', 'Erreur lors de la supression de votre logo.');
          response.redirect('/option/logo/edit');
        } else {
          request.flash('success', 'Logo supprimé.');
          response.redirect('/option/logo/edit');
        }
      });
    });
  },

  editFileModulePassword: function(request, response){
    response.render('option/editFileModulePassword');
  },

  editViews: function(request, response){
    var viewsPath = './app/views/themes/'+response.locals.options.theme;
    response.render('option/editViews', {files: fs.readdirSync(viewsPath)});
  },

  editView: function(request, response){
    var view = request.query.view;
    fs.readFile('./app/views/themes/'+response.locals.options.theme+'/'+view, 'utf8', function (err, data) {
      if (err) throw err;
      response.render('option/editView', {ejs: data, view: view});
    });
  },

  update: function (request, response) {
    var self = this;
    var properties = request.body.options;
    var optionFile = './configs/options.json';

    fs.readFile(optionFile, 'utf8', function (err, data) {
      if (err) throw err;
      var options = JSON.parse(data);
      options.pack = properties.pack;
      options.numberOfLines = properties.numberOfLines;
      options.mode = properties.mode;
      fs.writeFile(optionFile, JSON.stringify(options, null, 4), function(err) {
        if(err) {
          request.flash('danger', 'Erreur lors de la modification des options Gestiaweb.');
          response.redirect('/installation');
        } else {
          request.flash('success', 'Vos options ont été mises à jour.');
          response.redirect('/option/edit');
        }
      });
    });
  },

  /**
     * Update option
     * POST
     */
  updateContact: function (request, response) {
    var self = this;
    var properties = request.body.options;
    var optionFile = './configs/options.json';

    fs.readFile(optionFile, 'utf8', function (err, data) {
      if (err) throw err;
      var options = JSON.parse(data);
      options.lat = properties.lat;
      options.lng = properties.lng;
      options.zoom = properties.zoom;
      options.address = properties.address;
      options.cp = properties.cp;
      options.city = properties.city;
      options.complementary_address = properties.complementary_address;
      options.email = properties.email;
      options.phone = properties.phone;
      options.firstname = properties.firstname;
      options.lastname = properties.lastname;
      options.compagny = properties.compagny;
      options.textContact = properties.textContact;
      fs.writeFile(optionFile, JSON.stringify(options, null, 4), function(err) {
        if(err) {
          request.flash('danger', 'Erreur lors de la modification des options Gestiaweb.');
          response.redirect('/installation');
        } else {
          request.flash('success', 'Vos options ont été mises à jour.');
          response.redirect('/option/contact/edit');
        }
      });
    });
  },

  /**
     * Update option
     * POST
     */
  updateModule: function (request, response) {
    var self = this;
    var optionFile = './configs/options.json';

    var module = (request.params.module) ? request.params.module : request.body.module;
    var action = (request.params.action) ? parseInt(request.params.action) : parseInt(request.body.action);

    if (action === 1 || action === 0) {
      if (action === 1) state = true;
      else state = false;

      fs.readFile(optionFile, 'utf8', function (err, data) {
        if (err) throw err;
        var options = JSON.parse(data);
        switch(module){
          case 'blog':
            options.modules.blog.state = state;
            break;
          case 'portfolio':
            options.modules.portfolio.state = state;
            break;
          case 'contact':
            options.modules.contact.state = state;
            break;
          case 'file':
            options.modules.file.state = state;
            break;
          case 'event':
            options.modules.event.state = state;
            break;
          case 'ecommerce':
            options.modules.ecommerce.state = state;
            break;
        }
        fs.writeFile(optionFile, JSON.stringify(options, null, 4), function(err) {
          if(err) {
            request.flash('danger', 'Erreur lors de la modification des options Gestiaweb.');
            response.redirect('/installation');
          } else {
            request.flash('success', 'Vos options ont été mises à jour.');
            response.redirect('/option/modules/edit');
          }
        });
      });
    } else {
      var seoTitle = request.body.seoTitle;
      fs.readFile(optionFile, 'utf8', function (err, data) {
        if (err) throw err;
        var options = JSON.parse(data);
        switch(module){
          case 'blog':
            options.modules.blog.title = seoTitle;
            break;
          case 'portfolio':
            options.modules.portfolio.title = seoTitle;
            break;
          case 'contact':
            options.modules.contact.title = seoTitle;
            break;
          case 'file':
            options.modules.file.title = seoTitle;
            break;
          case 'event':
            options.modules.event.title = seoTitle;
            break;
          case 'ecommerce':
            options.modules.ecommerce.title = seoTitle;
            break;
        }
        fs.writeFile(optionFile, JSON.stringify(options, null, 4), function(err) {
          if(err) {
            request.flash('danger', 'Erreur lors de la modification des options Gestiaweb.');
            response.redirect('/installation');
          } else {
            request.flash('success', 'Vos options ont été mises à jour.');
            response.redirect('/option/modules/edit');
          }
        });
      });
    }
  },

  /**
     * Update option
     * POST
     */
  updateSeo: function (request, response) {
    var self = this;
    var properties = request.body.options;
    var optionFile = './configs/options.json';
    fs.readFile(optionFile, 'utf8', function (err, data) {
      if (err) throw err;
      var options = JSON.parse(data);
      options.title = properties.title;
      options.description = properties.description;
      options.keywords = properties.keywords;
      options.idga = properties.idga;
      fs.writeFile(optionFile, JSON.stringify(options, null, 4), function(err) {
        if(err) {
          request.flash('danger', 'Erreur lors de la modification des options Gestiaweb.');
          response.redirect('/installation');
        } else {
          request.flash('success', 'Vos options ont été mises à jour.');
          response.redirect('/option/seo/edit');
        }
      });
    });
  },

  /**
     * Update option
     * POST
     */
  updateSmo: function (request, response) {
    var self = this;
    var properties = request.body.options;
    var optionFile = './configs/socials.json';
    fs.readFile(optionFile, 'utf8', function (err, data) {
      if (err) throw err;
      var options = JSON.parse(data);
      options.facebook.smo = properties.facebook;
      options.twitter.smo = properties.twitter;
      options.google.smo = properties.google;
      fs.writeFile(optionFile, JSON.stringify(options, null, 4), function(err) {
        if(err) {
          request.flash('danger', 'Erreur lors de la modification des options Gestiaweb.');
          response.redirect('/installation');
        } else {
          request.flash('success', 'Vos options ont été mises à jour.');
          response.redirect('/option/smo/edit');
        }
      });
    });
  },

  /**
     * Update option
     * POST
     */
  updateRobots: function (request, response) {
    var self = this;
    var robots = request.body.robots;
    fs.writeFile('./public/robots.txt', robots, function(err) {
      if(err) {
        request.flash('danger', 'Erreur lors de la modification des options Gestiaweb.');
        response.redirect('/installation');
      } else {
        request.flash('success', 'Vos options ont été mises à jour.');
        response.redirect('/option/robots/edit');
      }
    });
  },

  updateCss: function (request, response) {
    var self = this;
    var css = request.body.css;
    var theme = response.locals.options.theme;
    fs.writeFile('./public/themes/'+theme+'.css', css, function(err) {
      if(err) {
        request.flash('danger', 'Erreur lors de la modification du fichier CSS.');
        response.redirect('/installation');
      } else {
        request.flash('success', 'Vos options ont été mises à jour.');
        response.redirect('/option/css/edit');
      }
    });
  },

  updateView: function (request, response) {
    var self = this;
    var ejs = request.body.ejs;
    var view = request.body.view;
    fs.writeFile('./app/views/themes/'+response.locals.options.theme+'/'+view, ejs, function(err) {
      if(err) {
        request.flash('danger', 'Erreur lors de la modification du fichier CSS.');
        response.redirect('/installation');
      } else {
        request.flash('success', 'Votre fichier a été mis à jour.');
        response.redirect('/option/view/edit?view='+view);
      }
    });
  },

  updateTheme: function (request, response) {
    var self = this;
    var theme = request.params.theme;
    var optionFile = './configs/options.json';
    fs.readFile(optionFile, 'utf8', function (err, data) {
      if (err) throw err;
      var options = JSON.parse(data);
      options.theme = theme;
      response.locals.themeOptions = JSON.parse(fs.readFileSync('./configs/themes/'+options.theme+'.json', 'utf8'));
      fs.writeFile(optionFile, JSON.stringify(options, null, 4), function(err) {
        if(err) {
          request.flash('danger', 'Erreur lors de la modification de votre thème.');
          response.redirect('/installation');
        } else {
          request.flash('success', 'Votre thème a été mis à jour.');
          response.redirect('/option/theme/edit');
        }
      });
    });
  },

  updateLogo: function(request, response){
    var self = this;
    var nameLogo = request.files.logo.name;
    var pathLogo = request.files.logo.path;
    var optionFile = './configs/options.json';
    fs.exists(pathLogo, function (exists) {
      if( exists ){
        fs.readFile(optionFile, 'utf8', function (err, data) {
          if (err) throw err;
          var options = JSON.parse(data);
          options.logo = nameLogo;
          fs.writeFile(optionFile, JSON.stringify(options, null, 4), function(err) {
            if(err) {
              request.flash('danger', 'Erreur lors de la modification de votre logo.');
              response.redirect('/installation');
            } else {
              request.flash('success', 'Logo sauvgardé.');
              response.redirect('/option/logo/edit');
            }
          });
        });
      }else{
        request.flash('danger', 'Erreur lors de l\'hébergement du fichier.');
        response.redirect('/option/logo/edit');
      }
    });
  },

  updateFileModulePassword: function(request, response){
    var self = this;
    var properties = request.body.options;
    if( properties.password === properties.confirm_password && ( properties.password.length >= 6 ) ){
      var optionFile = './configs/options.json';
      fs.readFile(optionFile, 'utf8', function (err, data) {
        if (err) throw err;
        var options = JSON.parse(data);
        options.modules.file.password = properties.password;
        fs.writeFile(optionFile, JSON.stringify(options, null, 4), function(err) {
          if(err) {
            request.flash('danger', 'Erreur lors de la modification du mot de passe.');
            response.redirect('/option/file/edit');
          } else {
            request.flash('success', 'Votre mot de passe a été mis à jour.');
            response.redirect('/file/_index');
          }
        });
      });
    }else{
      request.flash('success', 'Votre mot de passe de confirmation n\'est pas identique au mot de passe ou erreur avec la taille qui doit être de six caractères minimum.');
      response.redirect('/option/file/edit');
    }
  },

  /**
     * Delete option
     * GET
     */
  delete: function (request, response) {
    var self = this;
    var id = request.params.id;
    self.optionDao.get(id).success(function (option) {
      response.render('option/delete', { 'option': option });
    }).error(function (error) {
      request.flash('danger', 'Aucune option avec l\'id : ' + id);
      response.redirect(self.baseUrl);
    });
  },

  /**
     * Destroy option
     * POST
     */
  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    this.optionDao.delete(id, function (error) {
      if(error){
        request.flash('danger', error);
      }else{
        request.flash('success', 'Option supprimée.');
      }
      response.redirect(self.baseUrl);
    });
  },

  /**
     * Parse errors returned by model validation.
     */
  _parseValidationError: function (modelError) {
    if(_.isString(modelError)){ return modelError; }

    var errors = [];
    for (var key in modelError) {
      errors.push(modelError[key]);
    }
    return errors.join('<br>');
  }
});
