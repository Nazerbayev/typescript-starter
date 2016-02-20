var gulp 		= require('gulp'),
	less 		= require('gulp-less'),
	replace 	= require('gulp-replace'),
	rename 		= require('gulp-rename'),
	sourceMaps 	= require('gulp-sourcemaps'),
	source 		= require('vinyl-source-stream'),
	exorcist 	= require('exorcist'),
	browserify 	= require('browserify'),
	debowerify 	= require('debowerify'),
	tsify 		= require('tsify'),
	uglifyJS 	= require('gulp-uglify'),
	uglifyCSS 	= require('gulp-minify-css');

var config = {
	bowerDir: __dirname + '/bower_components',
	applicationDir: __dirname + "/src",
	stylesDir: __dirname + '/src/styles',
	publicDir: __dirname + '/public'
};

gulp.task('compile-js', function(){
	var bundler = browserify({
		basedir: config.applicationDir,
		debug: true
		}).add(config.applicationDir + '/app.ts')
		.plugin(tsify)
		.transform(debowerify);

	return bundler.bundle()
			.pipe(exorcist(config.publicDir + '/application.js.map'))
			.pipe(source('application.js'))
			.pipe(gulp.dest(config.publicDir));
});

gulp.task('uglify-js', function(){
	return gulp.src(config.publicDir + '/application.js')
			.pipe(uglifyJS())
			.pipe(rename('application.min.js'))
			.pipe(gulp.dest(config.publicDir));
});

gulp.task('compile-css', function() {
	return gulp.src(config.stylesDir + 'main.less')
			.pipe(sourceMaps.init())
			.pipe(less({paths: [config.stylesDir]}))
			.pipe(replace('../fonts/glyphicons', './fonts/bootstrap/glyphicons'))
			.pipe(rename('styles.css'))
			.pipe(sourceMaps.write('.'))
			.pipe(gulp.dest(config.publicDir));
});

gulp.task('uglify-css', ['compile-css'], function(){
	return gulp.src(config.publicDir + '/style.css')
			.pipe(uglifyCSS({
				keepSpecialComments: 0
			}))
			.pipe(rename('styles.min.css'))
			.pipe(gulp.dest(config.publicDir));
});

gulp.task('fonts-bootstrap', function(){
	return gulp.src(config.bowerDir + '/bootstrap/fonts/*')
			.pipe(gulp.dest(config.publicDir + '/fonts/bootstrap'));
});

gulp.task('fonts', ['fonts-bootstrap']);