var gulp            = require('gulp'),
    uglify          = require('gulp-uglify'),
    inject          = require('gulp-inject'),
    jshint          = require('gulp-jshint'),
    angularFilesort = require('gulp-angular-filesort'),
    bs              = require('browser-sync').create(),
    nodemon         = require('gulp-nodemon');

var paths = {
    index      : ['./client/index.html'],
    angular    : ['./client/assets/vendor/angular/*.js'],
    vendor     : ['./client/assets/vendor/*.js', './client/assets/vendor/*.css'],
    app        : ['./client/app/*.js'], // Node Express用のディレクトリ
    shared     : ['./client/app/shared/*.js'], 
    components : ['./client/app/componets/*.js']
};

gulp.task('inject', function() {
    return gulp.src(paths.index)
        .pipe(inject(gulp.src(paths.angular).pipe(angularFilesort()), {name: 'angular'}))
        .pipe(inject(gulp.src(paths.vendor, {read: false}), {name: 'vendor'}))
        .pipe(inject(gulp.src(paths.app, {read:false}), {name: 'app'}))
        .pipe(inject(gulp.src(paths.shared, {read: false}), {name: 'shared'}))
        .pipe(inject(gulp.src(paths.components, {read:false}), {name: 'components'}))
        .pipe(gulp.dest('./client'));
});

gulp.task('browser-sync', function() {
    var pathsArray = new Array();
    Object.keys(paths).forEach(function(key) {
        pathsArray = pathsArray.concat(paths[key]);
    });
    bs.init(null,
		{
		server: {
			baseDir: "./"
			,index  : paths.index     //インデックスファイル
		},
        files: pathsArray,
        browser: "google chrome"
    });
	console.info(pathsArray);
});

// js hint
gulp.task('jshint', function () {
	return gulp.src(paths.app, {read:false})
		.pipe( jshint() )
		.pipe( jshint.reporter('jshint-stylish') )
		.pipe( jshint.reporter('fail') ); // ← 変更
});

//gulp.task('nodemon', function(cb) {
//    return nodemon({script: './server/app.js'})
//    .on('start', function() {
//        cb();
//    })
//    .on('restart', function() {
//        console.log('nodemon restarted!');
//    });
//});

gulp.task('default', ['inject', 'browser-sync', 'jshint']); 
