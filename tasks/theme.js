var gulp = require('gulp'),
  prompt = require('gulp-prompt'),
  colors = require('colors');

gulp.task('theme', function() {
  return gulp.src('.')
    .pipe( prompt.prompt({
      type: 'input',
      name: 'theme',
      message: 'Nom de votre thème?'.red
    }, function(response){
      if (response.theme) {
        console.log(response.theme.yellow);
      } else {
        console.log('Vous devez saisir un nom pour votre thème.'.bold.red);
      }
    }));
});