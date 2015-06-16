+( function($){
	$(document).ready( function(){
		$('div.projects div.project').hover( function(){
			$(this).append('<div id="light"></div>');
		}, function(){
			$(this).children('#light').remove();
		}).on('click', function(){
			var id = $(this).attr('data-id');
			document.location.href = "/project/show/"+id;
		});

    	var $maps = $('#maps');

		var lat = parseFloat($maps.attr('data-lat'));
		var lng = parseFloat($maps.attr('data-lng'));
		var zoom = parseInt($maps.attr('data-zoom'));

		$maps.GoogleMap({
			lat: lat,
			lng: lng,
			zoom: zoom,
			el: $maps[0]
		});
	});
})(jQuery);