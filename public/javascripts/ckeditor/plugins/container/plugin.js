CKEDITOR.plugins.add( 'container', {
  requires: 'widget',
  icons: 'container',
  init: function( editor ) {
    editor.widgets.add('container', {
      button: 'Création d\'un container Gestiaweb',
      template:
      '<div class="container">'+
      '<div class="grid-12">Mon premier texte...</div>'+
      '<div class="clear"></div>'+
      '</div>',
      editables: {
        title: {
          selector: '.grid-12'
        }
      },
    });
  }
});
