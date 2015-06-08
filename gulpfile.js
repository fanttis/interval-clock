/*
------ Packages and variables
*/

var gulp = require('gulp'),
    run = require('run-sequence'),

    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),

    sass = require('gulp-ruby-sass'),
    minifyCSS = require('gulp-minify-css'),
    prefix = require('gulp-autoprefixer'),

    notify = require('gulp-notify'),
    make = require('gulp-concat');

var path =
{
    root: {
        scss:   'src/sass',
        js:     'src/scripts'
    },
    output: {
        css:   'assets/css',
        js:     'assets/scripts'
    }
}

/*
------ Utility tasks
*/

gulp.task('clean', function(cb) {
    del([ path.output+'/**'], cb);
});

/*
------ Asset compiling
*/

gulp.task('scripts', function() {
    return gulp.src([
        path.root.js+'/*.js'
    ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(make('main.js'))
    .pipe(uglify())
    .pipe(make('main.min.js'))
    .pipe(gulp.dest( path.output.js ))
    .on('error', notify.onError({ message: 'javascript compile... #error <%= error.message %>' }));
});

gulp.task('sass', function() {
    return gulp.src([
        path.root.scss+'/styles.scss'
    ])
    .pipe(sass({
        style: 'nested',
        noCache: true
    }))
    .pipe(make('main.css'))
    .pipe(prefix("last 2 version", "ie 9", "ie 8"))
    .pipe(gulp.dest( path.output.css ))
    .on('error', notify.onError({ message: 'sass compile... #error <%= error.message %>' }));
});

gulp.task('minify-css', function() {
    gulp.src(path.output.css+'/*.css')
        .pipe(minifyCSS({keepBreaks:false}))
        .pipe(gulp.dest(path.output.css))
});


/*
------ Watch tasks
*/

gulp.task('watch', function() {
    gulp.watch(path.root.js+'/*.js', ['scripts']);
    gulp.watch(path.root.scss+'/**/*', ['sass']);
    gulp.watch(path.output.css+'/*.css', ['minify-css']);
});

gulp.task('default', function() { console.log("Tasks: \n ´gulp watch´ - Run watch \n ´gulp build´ - Build all assets and minify \n ´gulp clean´ - Clean compiled assets "); });
