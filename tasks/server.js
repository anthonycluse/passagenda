var gulp           = require('gulp');
var browserSync    = require('browser-sync');

gulp.task('sync', ['start', 'watch'], function(cb) {
  browserSync.init({
    files: ['public/**/*.*', 'app/views/**/*.ejs'],
    proxy: 'http://localhost:3000',
    port: 4000,
    browser: ['google chrome']
    //open: false
  });
});