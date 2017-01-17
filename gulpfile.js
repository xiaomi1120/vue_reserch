var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var amdOptimize = require('amd-optimize');
var concatFile = require('gulp-concat');
var browserify=require('browserify');
var glob = require('glob');
var source = require('vinyl-source-stream');
var es = require('event-stream');
//compile less
gulp.task('less', function () {
    return gulp.src('less/admin.less')
        .pipe(less())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

//Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function () {
    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('vendor/jquery'));
    gulp.src(['node_modules/mithril/mithril.js', 'node_modules/mithril/mithril.min.js'])
        .pipe(gulp.dest('vendor/mithril'));
    gulp.src(['node_modules/bulma/css/bulma.css', 'node_modules/bulma/css/bulma.css.map'])
        .pipe(gulp.dest('vendor/bulma'));
    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('vendor/font-awesome'))
});

// Configure the browserSync task
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: ''
        }
    })
});
gulp.task('js', function () {
    gulp.src('js/*.js')
        .pipe(amdOptimize('common', {
            configFile: 'js/config.js',
            findNestedDependencies: true,
            include: false
        }))
        .pipe(concatFile('common.js'))
        .pipe(gulp.dest('./js/module/'))
});
gulp.task('browserify', function(done) {
    glob('js/*.js', function(err, files) {
        if(err) done(err);
        var tasks = files.map(function(entry) {
            return browserify({ entries: [entry] })
                .bundle()
                .pipe(source(entry))
                .pipe(rename({
                    dirname:'/',
                    extname: '.min.js'
                }))
                .pipe(gulp.dest('./js/assets/'));
        });
        es.merge(tasks).on('end', done);
    });
});
gulp.task('default', ['less', 'copy','js'], function () {
    gulp.watch('less/*.less', ['less']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});

// Dev task with browserSync
gulp.task('dev', ['less', 'copy', 'browserSync', 'js'], function () {
    gulp.watch('less/*.less', ['less']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
});

gulp.task('up', ['browserify'], function () {
console.log('success')
});
