var EXPRESS_PORT = 4000;
var outputName = utils;
var dest = "dist/"

var gulp = require('gulp');
var gutil = require('gulp-util');
var watchify = require('watchify');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var connect = require('gulp-connect');
var embedlr = require('gulp-embedlr');
var livereload = require('gulp-livereload');
var notify = require("gulp-notify");
var uglify = require('gulp-uglify');
var jsValidate = require('gulp-jsvalidate');

var log = function(mainMsg, secondaryMsg) {
	var args = ['[' + gutil.colors.green(new Date().toLocaleTimeString()) + ']'];
	if (mainMsg) args.push(gutil.colors.cyan(mainMsg));
	if (secondaryMsg) args.push(gutil.colors.magenta(secondaryMsg));
	gutil.log.apply(null, args);
};


gulp.task('connect', function() {
//	log('Running on http://localhost:' + EXPRESS_PORT);
	connect.server({
		port : 4000,
		livereload: true
	});
});
gulp.task('browserify', function() {
	gulp.src("./src/*.js").pipe(jsValidate()).on('error', 
		notify.onError({
			message: "Error: <%= error.message %>",
			title: "Failed running browserify"
		})).on('finish', function(){
			browserify("./src/main.js")
			.bundle({standalone: "YASQE", debug: true}).on('error', notify.onError({
		        message: "Error: <%= error.message %>",
		        title: "Failed running browserify"
		      })).on('prebundle', function(bundle) {
		    	  console.log("prebundle!");
		    	})
		    .pipe(source(outputName + '.js'))
		    .pipe(embedlr())
		    .pipe(gulp.dest(dest))
		    .pipe(connect.reload());
		});
		
		
});
gulp.task('minifyJs', function() {
	gulp.src(dest + "/" + outputName + ".js")
	.pipe(concat(outputName + '.min.js'))
    .pipe(uglify())
	.pipe(gulp.dest(dest));
});


gulp.task('watch', function() {
	gulp.watch(["./src/**/*.js"], [ 'browserify' ]);
	  gulp.watch(
		'./*.html'
	, function(files) {
		gulp.src(files.path).pipe(connect.reload());
	});
});


gulp.task('packageMinified', ['minifyJs', 'minifyCss']);
gulp.task('default', ['browserify', 'packageMinified']);
gulp.task('serve', ['browserify', 'minifyCss', 'watch', 'connect']);

