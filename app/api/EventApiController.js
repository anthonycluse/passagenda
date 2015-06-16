var Controller    = require('microscope-web').Controller;
var EventDao    = require('../dao/EventDao');
var securityFltrs = require('../filters/security');
var moment = require('moment');
var async = require('async');


module.exports = Controller.extend({

  baseUrl: "/api/event",

  initialize: function () {
    this.eventDao = new EventDao();
  },

  filters:[],

  routes: {
    'get /'             : 'getAll',
    'get /:id'          : 'get',
    'post /'            : 'post',
    'put /'             : 'put',
    'delete /:id'       : 'delete',
    'get /state/:state' : 'getAll'
  },

  getAll: function(request, response) {
    this.eventDao.getAll().success(function (events) {
      response.json(events);
    });
  },

  get: function (request, response) {
    var eventId = request.params.id;
    this.eventDao.get(eventId).success(function (event) {
      if(event){
        response.json(event);
      }else{
        response.send("Aucun événement : " + eventId);
      }
    });
  }
});
