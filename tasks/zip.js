var gulp  = require('gulp'),
  zip     = require('gulp-zip');

gulp.task('zip', function() {
  return gulp.src('./**/*')
    .pipe(zip('archive.zip'))
    .pipe(gulp.dest('.'));
});