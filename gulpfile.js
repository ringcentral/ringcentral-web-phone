(function() {

    /** @type {gulp.Gulp} */
    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        rename = require('gulp-rename'),
        sourcemaps = require('gulp-sourcemaps'),
        uglify = require('gulp-uglify'),
        fs = require('fs'),
        exec = require('child_process').exec,
        sourcemapsDebug = true;

    function execute(cmd){

        return function(cmd, cb) {

            exec(cmd, {cwd: __dirname}, function(e, stdout, stderr) {

                if (e === null) {
                    gutil.log(stdout);
                    return cb();
                }

                gutil.log(gutil.colors.red('External Command Error'));
                gutil.log(stdout);
                gutil.log(e.stack || e);
                gutil.log(stderr);

                cb(e);
            });

        }.bind(null, cmd)

    }

    gulp.task('webpack', [], execute('npm run webpack'));

    /**
     * Minifies build and bundle
     */
    gulp.task('uglify', ['webpack'], function() {

        return gulp
            .src(['./build/ringcentral-web-phone.js'])
            .pipe(sourcemaps.init({loadMaps: true, debug: sourcemapsDebug}))

            .pipe(uglify())

            .pipe(rename({suffix: '.min'}))

            .pipe(sourcemaps.write('.', {debug: sourcemapsDebug}))
            .pipe(gulp.dest('./build'));

    });

    /**
     * Propagates version number to package.json and bower.json
     */
    gulp.task('version', ['webpack'], function(cb) {

        var pkg = require('./package.json'),
            bower = require('./bower.json'),
            version = require('./build/ringcentral-web-phone').version;

        pkg.version = version;
        bower.version = version;

        fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
        fs.writeFileSync('./bower.json', JSON.stringify(bower, null, 2));

        gutil.log('Current version is', gutil.colors.magenta(version));

        cb();

    });

    /**
     * Quick Task
     */
    gulp.task('quick', ['webpack', 'version']);

    /**
     * Default Task
     */
    gulp.task('default', ['quick', 'uglify']);

})();