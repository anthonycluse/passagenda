+( function($){

  $(document).ready( function(){

    var hidden = true;
    var $uiBlockTitle = $('div.ui-block-title');

    $('button.top-bar-toggle').on('click', function(){
      if( hidden ){
        var $leftBarHtml = '';
        $('.ui-left-bar > ul').each( function(){
          $leftBarHtml += $(this).html();
        });
        $('.top-bar-ul').append($leftBarHtml);
        $('.ui-left-bar-divider').remove();
        $('.top-bar-ul').find('li').css({display: 'block'});
        hidden = false;
      }else{
        $('div.left-bar-toggle').remove();
        $('.top-bar-ul').find('li:not(.top-bar-title)').css({display: 'none'});
        hidden = true;
      }
    });

    $('nav.top-bar').find('li').on('click', function(e){
      var $this = $(this);
      if( $this.data('scrolling') ){
        e.preventDefault();
        var section = $this.children('a').attr('href');
        $('html, body').animate({
          scrollTop: $(section).position().top - $('nav.top-bar').height()
        }, 500, 'linear');
      }else{
        if( e.target.nodeName !== 'A' ){
          if( $this.children().attr('target') === '_blank' ){
            window.open($(this).children().attr('href'));
          }else{
            document.location.href = $(this).children().attr('href');
            return false;
          }
        }
      }
    });

    $('div.ui-left-bar > ul > li').hover( function(){
      var $this = $(this);
      $this.children('ul:not(.ui-left-bar-divider)').stop().slideDown(400);
    }, function(){
      var $this = $(this);
      $this.children('ul:not(.ui-left-bar-divider)').stop().slideUp(400);
    });

    $('div.alert').on('click', function(){
      $(this).fadeOut( function(){
        $(this).remove();
      });
    });

    $('a[data-toggle="modal"], button[data-toggle="modal"]').on('click', function(e){
      e.preventDefault();
      var $this = $(this);
      var $modal = $($this.attr('data-target'));
      $modal.Modal({
        action: 'open',
        width: $this.attr('data-modal-width')
      });
      $('div.modal-light').on('click', function(){
        $modal.Modal({action: 'hide'});
      });
    });

    if (window.devicePixelRatio > 1) {
      $('img.is-retina').each( function(){
        var $this = $(this);
        var src = $this.attr('src');
        var newSrc = src.replace('.', '@2x.');
        $this.attr('src', newSrc);
      });
    }

    $('li.side-bar-toggle').hover( function(){
      $(this).children('ul.side-bar-dropdown').stop().slideDown();
    }, function(){
      $(this).children('ul.side-bar-dropdown').stop().slideUp();
    });

    $(".top-bar-ul").find('li > a').each( function() {
      if (this.href === window.location.href) {
        $(this).parent().addClass("isActive");
      }
    });

    $('div.theme').hover( function(){
      $(this).find('div.light').fadeIn(100);
    }, function(){
      $(this).find('div.light').fadeOut(100);
    });

    if(typeof localStorage !== 'undefined') {
        if (localStorage.getItem('cookieCnil')) {
            $('#cookie').remove();
        }
    }

    $('#cookie > button').on('click', function(e) {
        e.preventDefault();
        $(this).parent().fadeOut();
        if(typeof localStorage !== 'undefined') {
          localStorage.setItem('cookieCnil', true);
        }
    });

  });

})(jQuery);
