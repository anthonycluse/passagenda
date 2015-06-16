var gulp       = require('gulp'),
    nodemon    = require('gulp-nodemon');

gulp.task('start', function (cb) {
  var called = false;
  return nodemon({
    script: './bin/www',
    watch: ['Application.js']
  }).on('start', function onStart() {
    if (!called) { cb(); }
    called = true;
  }).on('restart', function onRestart() {
    setTimeout(function reload() {
      browserSync.reload({
        stream: false
      });
    }, 500);
  });
});
