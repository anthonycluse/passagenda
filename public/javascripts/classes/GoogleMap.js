+( function($){

  $.fn.GoogleMap = function(options){

    var defaults = {
      lat: 44.923903,
      lng: 2.444126,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#acbcc9"}]},{"featureType":"landscape","stylers":[{"color":"#f2e5d4"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#c5c6c6"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#e4d7c6"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#fbfaf7"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#c5dac6"}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"road"},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{},{"featureType":"road","stylers":[{"lightness":20}]}],
      scrollwheel: false
    };

    var settings = $.extend({}, defaults, options);

    return this.each(function() {

      var $this = $(this);

      var latlng = new google.maps.LatLng(settings.lat, settings.lng);

      var mapOptions = {
        center: latlng,
        zoom: settings.zoom,
        mapTypeId: settings.mapTypeId,
        styles: settings.styles,
        scrollwheel: settings.scrollwheel
      };

      var map = new google.maps.Map(settings.el, mapOptions);

      var marqueur = new google.maps.Marker({
        position: latlng,
        map: map
      });

    });
  };

})(jQuery);
