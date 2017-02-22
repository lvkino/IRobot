var gulp = require('gulp'),
	watch = require('gulp-watch'),
	less = require('gulp-less'),
	sourcemaps = require('gulp-sourcemaps');


gulp.task('lessfile-watcher', function () {
 
    return watch('static/**/*.less', function () {
        gulp.src('static/**/*.less')
            .pipe(sourcemaps.init())
	  		.pipe(less())
	  		.pipe(sourcemaps.write())
	  		.pipe(gulp.dest('./static'));
    });

});