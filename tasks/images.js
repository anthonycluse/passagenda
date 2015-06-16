var gulp       = require('gulp'),
  imageResize  = require('gulp-image-resize'),
  changed      = require("gulp-changed");

gulp.task('images', function() {
  gulp.src('./public/uploads/*.{jpg,png}')
    .pipe(changed('dist'))
    .pipe(imageResize({ 
      width : 800,
      imageMagick: true
    }))
    .pipe(gulp.dest('./public/uploads/'));
});