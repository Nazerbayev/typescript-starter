var gulp 		= require('gulp'),
	less 		= require('gulp-less'),
	replace 	= require('gulp-replace'),
	rename 		= require('gulp-rename'),
	sourceMaps 	= require('gulp-sourcemaps'),
    browserify 	= require('browserify'),
    watchify 	= require('watchify'),
    source 		= require('vinyl-source-stream'),
    stringify 	= require('stringify'),
    exorcist	= require('exorcist'),
    debowerify	= require('debowerify'),
    uglifyJS	= require('gulp-uglify'),
    uglifyCSS	= require('gulp-minify-css'),
    tsify 		= require('tsify');

var config = {
	application: './src',
	public: './public',
    entrypoint: './src/app/app.ts',
    bundleName: 'application.js'
};
 opts = {
	basedir: config.application,
    cache: {},
    packageCache: {},
    debug: true,
    entries: config.entrypoint
};

var b = browserify(opts);
b = watchify(b, {poll: true});
b.plugin(tsify)
	.transform(debowerify),
    .on('update', bundle)
    .on('log', function(data) {
        console.log(data);
});

function bundle() {
    return b.bundle()
    	.pipe(exorcist(config.public + '/application.js.map'))
        .pipe(source(config.bundleName))
        .pipe(gulp.dest(config.public));
}


gulp.task('compile-js', bundle);

