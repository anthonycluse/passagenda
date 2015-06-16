var rewrite = require('express-urlrewrite');

exports.rewrite = function(app){
  app.use(rewrite('/blog/:id/:seoUrl', '/article/show/$1/$2'));
  app.use(rewrite('/blog', '/article'));
  app.use(rewrite('/telechargement', '/file'));
  app.use(rewrite('/p/:id/:seoUrl', '/page/show/$1/$2'));
}
