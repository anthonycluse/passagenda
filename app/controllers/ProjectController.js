/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var commonFltrs   = require('../filters/commons');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var ProjectDao    = require('../dao/ProjectDao');
var LinkDao    = require('../dao/LinkDao');
var ProjectCategoryDao   = require('../dao/ProjectCategoryDao');
var ProjectPhotoDao   = require('../dao/ProjectPhotoDao');
var _             = require('lodash');
var fs = require('fs');

/**
 * ProjectController class.
 */
module.exports = ProjectController = Controller.extend({

  baseUrl: "/project",

  initialize: function () {
    this.projectDao = new ProjectDao();
    this.projectCategoryDao = new ProjectCategoryDao();
    this.projectPhotoDao = new ProjectPhotoDao();
    this.linkDao = new LinkDao();
  },

  filters: [
    //securityFltrs.authorize,
    csrfFltrs.csrf
  ],

  routes: {
    'get /'           : 'index',
    'get /_index'        : { filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ], action: '_index' },
    'get /show/:id'   : 'show',
    'get /new'        : { filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ], action: 'new' },
    'post /create'    : { action: 'create', filters: [ securityFltrs.authorize ]},
    'get /edit/:id'   : { filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ], action: 'edit' },
    'post /update'    : { filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ], action: 'update' },
    'get /delete/:id' : { filters:[ csrfFltrs.antiForgeryToken, securityFltrs.authorize ], action: 'delete' },
    'post /destroy'   : { action: 'destroy', filters: [ securityFltrs.authorize ]}
  },

  /**
     * List projects
     * GET
     */
  index: function(request, response) {
    var self = this;
    self.linkDao.getAllByOrder().success( function(links){
      self.projectDao.getAllOnline().success(function (projects) {
        response.render('themes/'+response.locals.options.theme+'/projectIndex', {'projects': projects, links: links, seoTitle: response.locals.options.modules.portfolio.title});
      });
    });
  },

  /**
     * List projects
     * GET
     */
  _index: function(request, response) {
    this.projectDao.getAll().success(function (projects) {
      response.render('project/_index', {'projects': projects});
    });
  },

  /**
     * Show project
     * GET
     */
  show: function(request, response) {
    var self = this;
    var id = request.params.id;
    self.linkDao.getAllByOrder().success( function(links){
      self.projectDao.get(id).success(function (project) {
        if(!project){
          request.flash('danger', 'Aucun projet avec l\'id : ' + id);
          response.redirect(self.baseUrl);
        }else{
          response.render('themes/'+response.locals.options.theme+'/projectShow', {'project': project, links: links});
        }
      });
    });
  },

  /**
     * New project
     * GET
     */
  new: function (request, response) {
    this.projectCategoryDao.getAll().success( function(categories){
      if( categories.length > 0 ){
        response.render('project/new', {'categories': categories});
      }else{
        request.flash('danger', 'Vous devez ajouter au moins une catégorie pour ajouter un projet.');
        response.redirect('/project/_index');
      }
    });
  },

  /**
     * Create project
     * POST
     */
  create: function (request, response) {
    var self = this;
    var project = request.body.project;
    project.thumbnail = request.files.thumbnail.name;
    var sliders = request.files.slider;
    fs.exists(request.files.thumbnail.path, function (exists) {
      if( exists ){
        self.projectDao.save(project, function(modelError, project){
          if(modelError){
            request.flash('danger', self._parseValidationError(modelError));
            response.redirect('/project/new');
          }else{
            if( sliders.length > 1 ){
              _.forEach(sliders, function(slider){
                slider.ProjectId = project.id;
                slider.file = slider.name;
                self.projectPhotoDao.save(slider, function(projectPhoto){});
              });
            }else{
              sliders.ProjectId = project.id;
              sliders.file = sliders.name;
              self.projectPhotoDao.save(sliders, function(projectPhoto){});
            }
            request.flash('success', 'Projet sauvegardé.');
            response.redirect('/project/_index');
          }
        });
      }else{
        request.flash('danger', 'Erreur avec le fichier.');
        response.redirect('/media/new');
      }
    });
  },

  /**
     * Edit project
     * GET
     */
  edit: function (request, response) {
    var id = request.params.id;
    this.projectDao.get(id).success(function (project) {
      response.render('project/edit', {'project': project, 'errors': null });
    });
  },

  /**
     * Update project
     * POST
     */
  update: function (request, response) {
    var self = this;
    var properties = request.body.project;
    this.projectDao.update(properties, function (modelError, project) {
      if(project){
        if(modelError){
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/project/edit/' + properties.id);
        }else{
          request.flash('success', 'Projet mis à jour.');
          response.redirect(self.baseUrl+'/_index');
        }
      }else{
        request.flash('danger', 'Aucun projet avec l\'id : ' + properties.id);
        response.redirect(self.baseUrl+'/_index');
      }
    });
  },

  /**
     * Delete project
     * GET
     */
  delete: function (request, response) {
    var id = request.params.id;
    this.projectDao.get(id).success(function (project) {
      response.render('project/delete', { 'project': project });
    }).error(function (error) {
      request.flash('danger', 'Aucun projet avec l\'id : ' + id);
      response.redirect(self.baseUrl+'/_index');
    });
  },

  /**
     * Destroy project
     * POST
     */
  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    this.projectDao.get(id).success( function(project){
      // on supprile le thumbnail du projet
      fs.unlinkSync('public/uploads/'+project.thumbnail);
      // puis les images slider
      self.projectPhotoDao.getAllByProjectId(id).success( function(projectPhotos){
        if( projectPhotos.length > 1 ){
          _.forEach(projectPhotos, function(projectPhoto){
            fs.unlinkSync('public/uploads/'+projectPhoto.file);
            self.projectPhotoDao.delete(projectPhoto.id, function(){});
          });
          self.projectDao.delete(id, function (error) {
            request.flash('success', 'Projet supprimée');
            response.redirect(self.baseUrl+'/_index');
          });
        }else{
          fs.unlinkSync('public/uploads/'+projectPhotos[0].file);
          self.projectPhotoDao.delete(projectPhotos[0].id, function(){
            self.projectDao.delete(id, function (error) {
              request.flash('success', 'Projet supprimée');
              response.redirect(self.baseUrl+'/_index');
            });
          });
        }
      });
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
