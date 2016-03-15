(function() {

    /** @type {gulp.Gulp} */
    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        fs = require('fs');

    /**
     * Propagates version number to package.json and bower.json
     */
    gulp.task('version', function(cb) {

        var pkg = require('./package.json'),
            bower = require('./bower.json'),
            version = require('./src/ringcentral-web-phone').version;

        pkg.version = version;
        bower.version = version;

        fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
        fs.writeFileSync('./bower.json', JSON.stringify(bower, null, 2));

        gutil.log('Current version is', gutil.colors.magenta(version));

        cb();

    });

    /**
     * Default Task
     */
    gulp.task('default', ['version']);

})();