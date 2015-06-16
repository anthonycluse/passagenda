+( function($){
	$(document).ready( function(){
        
        var isMobile = {
            Android: function() {
                return navigator.userAgent.match(/Android/i);
            },
            BlackBerry: function() {
                return navigator.userAgent.match(/BlackBerry/i);
            },
            iOS: function() {
                return navigator.userAgent.match(/iPhone|iPad|iPod/i);
            },
            Opera: function() {
                return navigator.userAgent.match(/Opera Mini/i);
            },
            Windows: function() {
                return navigator.userAgent.match(/IEMobile/i);
            },
            any: function() {
                return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
            }
        };
        
        
        if (isMobile.any() === null || window.outerWidth > 480) {
            $('div.projects div.project').hover( function(){
                $(this).append('<div id="light"><img src="/images/themes/adms/PROJECT_SHOW.png"/></div>');
            }, function(){
                $(this).children('#light').remove();
            }).on('click', function(){
                $('body').append('<div id="light"></div>');
                var $this = $(this);
                $this.next().slideDown();
            });
        }

		$(document).on('keydown', function(e) {
			switch(e.keyCode){
				case 27:
					$('div.projectShow').slideUp( function(){
						$('body > #light').remove();
					});
				break;
			}
		});

		var styles = [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}];

    	var $maps = $('#maps');

		var lat = parseFloat($maps.attr('data-lat'));
		var lng = parseFloat($maps.attr('data-lng'));
		var zoom = parseInt($maps.attr('data-zoom'));

		$maps.GoogleMap({
			lat: lat,
			lng: lng,
			zoom: zoom,
			el: $maps[0],
      		styles: styles
		});
	});
})(jQuery);