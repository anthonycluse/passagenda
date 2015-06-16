+( function($){

  $.fn.Modal = function(options){

    var defaults = {
      width: 500
    };

    var settings = $.extend({}, defaults, options);

    return this.each(function() {
      var $this = $(this);
      switch(settings.action){
        case 'open':
          $('body').prepend('<div class="modal-light"></div>');
          $('div.modal-light').fadeIn( function(){
            $this.css({
              width: settings.width,
              marginLeft: '-'+(settings.width/2)
            });
            $this.fadeIn();
          });
          break;
        case 'hide':
          $this.fadeOut( function(){
            $('div.modal-light').fadeOut( function(){
              $('div.modal-light').remove();
            });
          });
          break;
      }
    });
  };


})(jQuery);
