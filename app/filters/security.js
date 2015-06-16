/**
* authorize users filters
*/
exports.authorize = function (request, response, next){
  if (request.isAuthenticated()) {
    return next();
  }else{
    var returnUrl = request.originalUrl;
    if(request.xhr){
      response.send("Vous n'êtes pas autorisé à accéder à cette page");
    }else{
      request.flash('danger', "Vous n'êtes pas autorisé à accéder à cette page");
      response.redirect('/user?returnUrl='+returnUrl);
    }
  }
};

/*
 * authorize only admin filters
 */
exports.authorizeAdmin = function (request, response, next) {
  if ( request.isAuthenticated() && ( request.user.right === 1 || request.user.right === 0 ) ) {
    return next();
  }else{
    var returnUrl = request.originalUrl;
    if(request.xhr){
      response.send("Vous n'êtes pas autorisé à accéder à cette page");
    }else{
      request.flash('danger', "Vous n'êtes pas autorisé à accéder à cette page");
      response.redirect('/user?returnUrl='+returnUrl);
    }
  }
};

/*
 * authorize only super admin filters
 */
exports.authorizeSuperAdmin = function (request, response, next) {
  if ( request.isAuthenticated() && request.user.right === 0 ) {
    return next();
  }else{
    var returnUrl = request.originalUrl;
    if(request.xhr){
      response.send("Vous n'êtes pas autorisé à accéder à cette page");
    }else{
      request.flash('danger', "Vous n'êtes pas autorisé à accéder à cette page");
      response.redirect('/user?returnUrl='+returnUrl);
    }
  }
};

/*
 * Autorise les utilisateur du pack avantage
*/
exports.authorizeAvantage = function (request, response, next) {
  if ( request.isAuthenticated() && request.user.pack === 'avantage' ) {
    return next();
  }else{
    var returnUrl = request.originalUrl;
    if(request.xhr){
      response.send("Vous n'êtes pas autorisé à accéder à cette page");
    }else{
      request.flash('danger', "Vous n'êtes pas autorisé à accéder à cette page");
      response.redirect('/user?returnUrl='+returnUrl);
    }
  }
};

/*
 * Autorise les utilisateurs du pack basique
*/
exports.authorizeBasique = function (request, response, next) {
  if ( request.isAuthenticated() && request.user.pack === 'basique' ) {
    return next();
  }else{
    var returnUrl = request.originalUrl;
    if(request.xhr){
      response.send("Vous n'êtes pas autorisé à accéder à cette page");
    }else{
      request.flash('danger', "Vous n'êtes pas autorisé à accéder à cette page");
      response.redirect('/user?returnUrl='+returnUrl);
    }
  }
};

/*
 * Autorise les utilisateurs du pack basique
*/
exports.authorizeModuleFile = function (request, response, next) {
  if ( request.session.authmodulefile === true ) {
    return next();
  }else{
    var returnUrl = request.originalUrl;
    if(request.xhr){
      response.send("Vous n'êtes pas autorisé à accéder à cette page");
    }else{
      request.flash('danger', "Vous n'êtes pas autorisé à accéder à cette page");
      response.redirect('/file/login?returnUrl='+returnUrl);
    }
  }
};
