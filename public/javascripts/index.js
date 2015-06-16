( function($){
  $(document).ready( function(){

    var jsonEvents = [];
    var events = [];

    $.ajax({
      url: '/api/event',
      dataType: 'json',
      async: false,
      success: function(data){
        jsonEvents = data;
      }
    });

    jsonEvents.forEach( function(event, index, evts){
      events[index] = {};
      events[index].start = event.start;
      events[index].end = event.end;
      events[index].backgroundColor = event.EventCategory.color;
      events[index].title = event.title;
      events[index].id = event.id;
    });

    $('#calendar').fullCalendar({
      lang: 'fr',
      header: {
        left:   'today prev,next',
        center: 'title',
        right:  'agendaDay month agendaWeek'
      },
      weekends: true,
      defaultView: 'agendaWeek',
      dayClick: function(date){
        console.log(date);
      },
      events: events,
      eventClick: function(calEvent, jsEvent, view) {
        document.location.href = '/event/edit/'+calEvent.id;
      }
    });
  });
})(jQuery);
