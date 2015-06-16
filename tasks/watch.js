var gulp         = require('gulp'),
    compass      = require('gulp-compass'),
    plumber      = require('gulp-plumber');

var paths = {
  scss: './public/sass/**/*.scss',
  js: './public/javascripts/**/*.js',
  css: './public/stylesheets/*.css',
  ejs: './app/views/**/*.ejs',
  config: './public/config.rb',
  sassDirectory: './public/sass',
  cssDirectory: './public/stylesheets'
};

gulp.task('compass', function(){
  return gulp.src(paths.scss)
    .pipe(plumber())
    .pipe(compass({
      config_file: paths.config,
      css: paths.cssDirectory,
      sass: paths.sassDirectory
    }))
    .pipe(gulp.dest(paths.cssDirectory));
});

gulp.task('watch', function(){
  gulp.watch(paths.scss, ['compass']);
});