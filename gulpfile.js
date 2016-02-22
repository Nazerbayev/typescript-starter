var gulp 		= require('gulp'),
    del         = require('del'),
	less 		= require('gulp-less'),
    watch       = require('gulp-watch'),
    concat      = require('gulp-concat'),
	sourceMaps 	= require('gulp-sourcemaps'),
    browserify 	= require('browserify'),
    watchify 	= require('watchify'),
    source 		= require('vinyl-source-stream'),
    exorcist	= require('exorcist'),
    debowerify	= require('debowerify'),
    uglifyJS	= require('gulp-uglify'),
    uglifyCSS	= require('gulp-minify-css'),
    tsify 		= require('tsify');

var config = {
    source: {
        root: './src',
        static_files: ['./src/app/**/*.html', './src/assets/**/*', './src/fonts/**/*'],
        entrypoint: './src/app/app.ts',
        styles: ['./src/**/*.less'],
    },
    styles_concatenated_filename: 'main.less',
	public: {
        root: './dist',
        styles: './dist/styles',
        fonts: './dist/fonts',
        jsname: 'application.js',
        sourcemap: 'application.js.map',
        assets: './dist/assets'
    }
};
 opts = {
	basedir: config.source.root,
    cache: {},
    packageCache: {},
    debug: true,
    entries: config.source.entrypoint
};

var b = browserify(opts);
b = watchify(b, {poll: true});
b.plugin(tsify)
	.transform(debowerify)
    .on('update', bundle)
    .on('log', function(data) {
        console.log(data);
});

function bundle() {
    return b.bundle()
    	.pipe(exorcist(config.public.sourcemap))
        .pipe(source(config.public.jsname))
        .pipe(gulp.dest(config.public.root));
}


gulp.task('compile-js', bundle);

// concat all less files
var pipes = {
    compileLESS: function() {
        //TODO: add sourcemaps
        return gulp.src(config.source.styles)
                .pipe(concat(config.styles_concatenated_filename))
                .pipe(less())
                .pipe(gulp.dest(config.public.styles));
    },
    watchStaticFiles: function() {
        return gulp.src(config.source.static_files)
            .pipe(watch(config.source.root, { base: config.source.root }))
            .pipe(gulp.dest(config.public.root));
    },
    copyBowerComponents: function() {
        return gulp.src(bowerFiles(["**/*.js", "**/*.css"]))
            .pipe(gulp.dest(config.public.root));
    },
    clean: function(){
        return del(config.public.root);
    }
};

gulp.task('watch-static-files', function() {
    return pipes.watchStaticFiles();
});

