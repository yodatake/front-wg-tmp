var gulp            = require('gulp'),
    uglify          = require('gulp-uglify'),
    inject          = require('gulp-inject'),
    jshint          = require('gulp-jshint'),
    angularFilesort = require('gulp-angular-filesort'),
    bs              = require('browser-sync').create(),
    karma           = require('gulp-karma');
    

var paths = {
    index      : ['./src/index.html'],
    angular    : ['./src/assets/vendor/angular/*.js'],
    vendor     : ['./src/assets/vendor/*.js', './src/assets/vendor/*.css'],
	app        : ['./src/app/*.js', "./src/assets/css/*.css"],
	controllers : ['./src/app/controllers/*.js'],
	models     : ['./src/app/models/*.js'],
	shared     : ['./src/app/shared/*.js'], 
    components : ['./src/app/componets/*.js']
};

var testFiles = [
    	'src/assets/vendor/angular/angular.min.js',
    	'src/assets/vendor/angular/angular-mocks.js',
	'src/assets/vendor/moment-with-locales.min.js',

	'src/app/**/*.js',
	'src/app/**/*.spec.js'
];

gulp.task('inject', function() {
    return gulp.src(paths.index)
        .pipe(inject(gulp.src(paths.angular).pipe(angularFilesort()), {name: 'angular'}))
        .pipe(inject(gulp.src(paths.vendor, {read: false}), {name: 'vendor'}))
        .pipe(inject(gulp.src(paths.app, {read:false}), {name: 'app'}))
        .pipe(inject(gulp.src(paths.shared, {read: false}), {name: 'shared'}))
        .pipe(inject(gulp.src(paths.components, {read:false}), {name: 'components'}))
		.pipe(inject(gulp.src(paths.controllers, {read:false}), {name: 'controllers'}))
		.pipe(inject(gulp.src(paths.models, {read:false}), {name: 'models'}))
		.pipe(gulp.dest('./src'));
});

gulp.task('browser-sync', function() {
    var pathsArray = new Array();
    Object.keys(paths).forEach(function(key) {
        pathsArray = pathsArray.concat(paths[key]);
    });
    bs.init(null,
		{
		server: {
			baseDir: "./", // browser-syncサーバで提供するコンテンツ
			index  : paths.index     //インデックスファイル
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

// karma
gulp.task('karma', function () {
	return gulp.src(testFiles)
		.pipe(karma(
		{
			configFile: 'karma.conf.js',
			action: 'watch'
		}));
	
});

gulp.task('default', ['inject', 'browser-sync', 'jshint']);
