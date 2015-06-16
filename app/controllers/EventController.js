/**
 * Imports.
 */
var Controller    = require('microscope-web').Controller;
var commonFltrs   = require('../filters/commons');
var securityFltrs = require('../filters/security');
var csrfFltrs     = require('../filters/csrf');
var EventDao    = require('../dao/EventDao');
var _             = require('lodash');
var moment = require('moment');
var nodemailer = require('nodemailer');
var EventCategoryDao = require('../dao/EventCategoryDao');

/**
 * AppointmentController class.
 */
module.exports = EventController = Controller.extend({

  baseUrl: "/event",

  initialize: function () {
    this.eventDao = new EventDao();
    this.eventCategoryDao = new EventCategoryDao();
  },

  filters: [
    securityFltrs.authorize,
    csrfFltrs.csrf
  ],

  routes: {
    'get /'           : 'index',
    'get /show/:id'   : 'show',
    'get /new'        : { filters:[ csrfFltrs.antiForgeryToken ], action: 'new' },
    'post /create'    : 'create',
    'get /edit/:id'   : { filters:[ csrfFltrs.antiForgeryToken ], action: 'edit' },
    'post /update'    : { filters:[ csrfFltrs.antiForgeryToken ], action: 'update' },
    'get /delete/:id' : { filters:[ csrfFltrs.antiForgeryToken ], action: 'delete' },
    'post /destroy'   : 'destroy'
  },

  index: function(request, response) {
    var self = this;
    this.eventDao.getAll().success(function (events) {
      response.render('event/index', {
        events: events
      });
    });
  },

  show: function(request, response) {
    var id = request.params.id;
    this.eventDao.get(id).success(function (appointment) {
      if(!appointment){
        request.flash('danger', 'no appointment with id: ' + id);
        response.redirect(self.baseUrl);
      }else{
        response.render('appointment/show', {'appointment': appointment});
      }
    });
  },

  new: function (request, response) {
    var self = this;
    self.eventCategoryDao.getAll().success( function(categories){
      var now = moment();
      var likeYear = now.year();
      var likeDay = now.date();
      var formatedDay = ( likeDay > 9 ) ? likeDay : '0'+likeDay;
      var likeMonth = now.month()+1;
      var formatedMonth = ( likeMonth > 9 ) ? likeMonth : '0'+likeMonth;
      response.render('event/new', {
        day: likeDay,
        month: likeMonth,
        year: likeYear,
        categories: categories
      });
    });
  },

  create: function (request, response) {
    var self = this;
    var a = request.body.event;
    var start = moment.utc(a.startmonth+'-'+a.startday+'-'+a.startyear+' '+a.starthour+':'+a.startminute, "MM-DD-YYYY HH:mm");
    var end = moment.utc(a.endmonth+'-'+a.endday+'-'+a.endyear+' '+a.endhour+':'+a.endminute, "MM-DD-YYYY HH:mm");
    var event = {
      title: a.title,
      start: start._d,
      end: end._d,
      EventCategoryId: a.EventCategoryId,
    };
    self.eventDao.save(event, function(modelError, event){
      if(modelError){
        request.flash('danger', self._parseValidationError(modelError));
        response.redirect('/event/new');
      }else{
        request.flash('success', 'Evénement enregistré !');
        response.redirect(self.baseUrl);
      }
    });
  },

  edit: function (request, response) {
    var self = this;
    var id = request.params.id;
    this.eventDao.get(id).success(function (event) {
      var start = moment.utc(event.start);
      var end = moment.utc(event.end);
      self.eventCategoryDao.getAll().success( function(categories){
        response.render('event/edit', {
          'event': event,
          'errors': null,
          start: start,
          end: end,
          categories: categories
        });
      });
    });
  },

  update: function (request, response) {
    var self = this;
    var properties = request.body.event;
    var a = request.body.event;
    var start = moment.utc(a.startmonth+'-'+a.startday+'-'+a.startyear+' '+a.starthour+':'+a.startminute, "MM-DD-YYYY HH:mm");
    var end = moment.utc(a.endmonth+'-'+a.endday+'-'+a.endyear+' '+a.endhour+':'+a.endminute, "MM-DD-YYYY HH:mm");
    var event = {
      id: a.id,
      title: a.title,
      start: start._d,
      end: end._d,
      EventCategoryId: a.EventCategoryId
    };
    this.eventDao.update(event, function (modelError, event) {
      if(event){
        if(modelError){
          request.flash('danger', self._parseValidationError(modelError));
          response.redirect('/event/edit/' + properties.id);
        }else{
          request.flash('success', 'Evénement enregistré !');
          response.redirect(self.baseUrl);
        }
      }else{
        request.flash('danger', 'Aucun événement avec l\id : ' + properties.id);
        response.redirect(self.baseUrl);
      }
    });
  },

  delete: function (request, response) {
    var id = request.params.id;
    this.eventDao.get(id).success(function (event) {
      response.render('event/delete', {'event': event});
    }).error(function (error) {
      request.flash('danger', 'Pas d\'événement avec l\'id: ' + id);
      response.redirect(self.baseUrl);
    });
  },

  destroy: function (request, response) {
    var self = this;
    var id = request.body.id;
    this.eventDao.delete(id, function (error) {
      request.flash('success', 'Evénement supprimé !');
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
