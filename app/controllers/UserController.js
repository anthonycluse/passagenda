/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var UserDao       = require('../dao/UserDao');
var LinkDao       = require('../dao/LinkDao');
var passport      = require('passport');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var _             = require('lodash');
var fs            = require('fs');

/**
 * HomeController class.
 */
module.exports = AccountController = Controller.extend({

  baseUrl: "/user",

  initialize: function () {
    this.linkDao = new LinkDao();
    this.userDao = new UserDao();
  },

  filters:[
    csrfFltrs.csrf
  ],

  routes: {
    'get /'                : { action: 'login', filters:[csrfFltrs.antiForgeryToken] },
    'get /_index'          : { action: '_index', filters:[csrfFltrs.antiForgeryToken, securityFltrs.authorizeSuperAdmin] },
    'get /login'           : { action: 'login', filters:[csrfFltrs.antiForgeryToken] },
    'get /signin'          : { action: 'signin', filters:[csrfFltrs.antiForgeryToken] },
    'post /signup'         : { action: 'signup' },
    'get /register'        : { action: 'register', filters:[csrfFltrs.antiForgeryToken, securityFltrs.authorizeAdmin] },
    'get /logout'          : { action: 'logout' },
    'post /logon'          : { action: 'logon', filters:[passport.authenticate('local', { failureRedirect: '/user/'})]},
    'get /edit'            : { action: 'edit', filters:[ securityFltrs.authorize, csrfFltrs.antiForgeryToken]},
    'post /updatepassword' : { action: 'updatePassword' },
    'post /updateprofil'   : { action: 'updateProfil' },
    'get /installation'    : { action: 'installation', ignoreBaseUrl: true, filters:[ csrfFltrs.antiForgeryToken ]},
    'post /installation'   : { action: 'signupsa'},
    'get /delete/:id'      : { action: 'delete', filters:[ securityFltrs.authorizeSuperAdmin, csrfFltrs.antiForgeryToken]},
    'post /destroy'        : { action: 'destroy', filters:[ securityFltrs.authorizeSuperAdmin ] }
  },

  delete: function(request, response){
    var id = request.params.id;
    this.userDao.get(id).success( function(user){
      response.render('user/delete', {user: user});
    });
  },

  destroy: function (request, response) {
    var id = request.body.id;
    this.userDao.delete(id, function (error) {
      request.flash('success', 'Utilisateur supprimée');
      response.redirect('/user/_index');
    });
  },

  _index: function(request, response){
    this.userDao.getAllAdmin().success( function(users){
      response.render('user/_index', {users: users});
    });
  },

  /*
   * Show the installtion page
   */
  installation: function(request, response){
    response.render('installation');
  },

  /*
   * Sign up super administrator
   * right : 0
   */
  signupsa: function(request, response) {
    var self = this;
    var user = request.body.user;
    var optionFile = './configs/options.json';
    user.right = parseInt(user.right);
    if(user.password === user.confirmPassword && user.password.length > 6){
      this.userDao.getAllByRight(user.right).success(function (findedUser) {
        if( !findedUser.length ){
          fs.readFile(optionFile, 'utf8', function (err, data) {
            if (err) throw err;
            var options = JSON.parse(data);
            options.pack = request.body.options["pack"];
            options.theme = request.body.options["theme"];
            fs.writeFile(optionFile, JSON.stringify(options, null, 4), function(err) {
              if(err) {
                request.flash('danger', 'Erreur lors de la création des options Gestiaweb');
                response.redirect('/installation');
              } else {
                self.userDao.save(user, function (error, user) {
                  if(error){
                    request.flash('danger', self._parseValidationError(error));
                    response.redirect('/installation');
                  }else{
                    request.flash('success', 'Enregistrement éffectué');
                    response.redirect('/user/login');
                  }
                });
              }
            });
          });
        }else{
          request.flash('danger', 'Le super administrateur est déjà enregistré. Essayez de vous connecter');
          response.redirect('/user/login');
        }
      });
    }else{
      request.flash('danger', 'Le mot de passe doit faire au miminum six caractères ! Ou il y a une erreur avec le mot de passe de confirmation...');
      response.redirect('/installation');
    }
  },

  /*
   * Show login page
   */
  login: function(request, response) {
    var returnUrl = request.query.returnUrl;
    if( !returnUrl ) returnUrl = '/';
    response.render('user/login', {returnUrl: returnUrl, layoutFile: false});
  },
  signin: function(request, response) {
    this.linkDao.getAllByOrder().success( function(links){
      response.render('themes/'+response.locals.options.theme+'/login', {layoutFile: false, links: links});
    });
  },

  /**
     * POST
     * logon
     */
  logon: function(request, response) {
    request.flash('success', 'Connexion réussie');
    response.redirect(request.body.returnUrl);
  },

  /**
     * GET
     * logout
     */
  logout: function(request, response) {
    request.logout();
    response.redirect('/glovebox');
  },

  /**
     * GET
     * user settings form
     */
  edit: function (request, response) {
    this.userDao.get(request.user.id).success( function(user){
      response.render('user/edit', {user: user});
    });
  },

  /**
     * GET
     * register user form
     */
  register: function(request, response) {
    response.render('user/register');
  },

  /**
     * POST
     * signup user
     */
  signup: function(request, response) {
    var self = this;
    var user = request.body.user;

    if(user.password === user.confirmPassword && user.password.length > 6){
      this.userDao.getByUsername(user.username).success(function (findedUser) {
        if(!findedUser){
          self.userDao.save(user, function (error, user) {
            if(error){
              request.flash('danger', self._parseValidationError(error));
              response.redirect('/user/register');
            }else{
              request.flash('success', 'Enregistrement éffectué');
              response.redirect('/user/_index');
            }
          });
        }else{
          request.flash('danger', 'Ce nom utilisateur existe déjà');
          response.redirect('/user/register');
        }
      });
    }else{
      request.flash('danger', 'Le mot de passe doit faire au miminum six caractères ! Ou il y a une erreur avec le mot de passe de confirmation...');
      response.redirect('/user/register');
    }
  },

  /**
     * POST
     * update password
     */
  updatePassword: function (request, response) {
    var self = this;
    var model = request.body;
    if(model.newPassword === model.confirmNewPassword && model.newPassword.length > 6){
      this.userDao.updatePassword(
        request.user.id, model.oldPassword, model.newPassword,
        function (err, user) {
          if(err){
            request.flash('danger', self._parseValidationError(err));
            response.redirect('/user/settings');
          }else{
            request.flash('success', 'Votre mot de passe a bien été mis à jour');
            response.redirect('/');
          }
        });
    }else{
      request.flash('danger', 'Le mot de passe doit faire au miminum six caractères ! Ou il y a une erreur avec le mot de passe de confirmation...')
      response.redirect('/user/settings');
    }
  },

  /**
     * POST
     * update password
     */
  updateProfil: function (request, response) {
    var self = this;
    var user = request.body.user;
    this.userDao.updateProfil(request.user.id, user, function(err, user){
      if(err){
        request.flash('danger', self._parseValidationError(err));
        response.redirect('/user/settings');
      }else{
        request.flash('success', 'Profil mis à jour');
        response.redirect('/user/edit');
      }
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
