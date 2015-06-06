var gulp = require('gulp');
var typescript = require('gulp-tsc');
var babel = require('gulp-babel');
var compass = require('gulp-compass');
var plumber = require('gulp-plumber');


var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer-core');

var pleeease = require('gulp-pleeease');
var spritesmith = require('gulp.spritesmith');

var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');

var fs = require('fs');
var path = require('path');

var getFolders = function (dir) {
	return fs.readdirSync(dir)
		.filter(function (file) {
			return fs.statSync(path.join(dir, file)).isDirectory();
		});
}


var root = 'public';
var server = '.';

var ts = 'typescript';
var js = 'js';
var es6 = 'es6';
var img = 'img';
var sass = 'sass';
var css = 'css';

var dest = '_min';


//TypeScript
var typescriptDir = root + '/' + ts + '/';
var typescriptWatchFiles = typescriptDir + '**/*.ts';
var jsDir = root + '/' + js + '/';
gulp.task('typescript', function(){
	gulp.src([typescriptWatchFiles])
	.pipe(plumber())
	.pipe(typescript({module:"amd"}))
	.pipe(gulp.dest(jsDir));
});
//TypeScript commonjs
var typescriptCommonjsDir = server + '/' + ts + '/';
var typescriptCommonjsWatchFiles = typescriptCommonjsDir + '**/*.ts';
var commonjsDir = server + '/';
gulp.task('typescriptCommonjs', function(){
	gulp.src([typescriptCommonjsWatchFiles])
	.pipe(plumber())
	.pipe(typescript({module:"commonjs"}))
	.pipe(gulp.dest(commonjsDir));
});

//es6
var es6Dir = root + '/' + es6 + '/';
var es6WatchFiles = es6Dir + '**/*.js';
gulp.task('es6', function(){
	gulp.src([es6WatchFiles])
			.pipe(plumber())
			.pipe(babel({
				sourceMap: false,
				modules: 'amd'
			}))
			.pipe(gulp.dest(jsDir));
});
//es6 commonjs
var es6CommonjsDir = server + '/' + es6 + '/';
var es6CommonjsWatchFiles = es6CommonjsDir + '**/*.ts';
gulp.task('es6Commonjs', function(){
	gulp.src([es6CommonjsWatchFiles])
			.pipe(plumber())
			.pipe(babel({module:"commonjs"}))
			.pipe(gulp.dest(commonjsDir));
});

//Compass
var sassDir = root + '/' + sass + '/';
var cssDir = root + '/' + css + '/';
var sassWatchFiles = sassDir + '**/*.scss';
var cssWatchFiles = cssDir + '**/*.css';
gulp.task('compass_pleeease', function(){
	gulp.src([sassWatchFiles])
	.pipe(plumber())
	.pipe(compass({
		bundle_exec: true,
		config_file : 'config.rb',
		comments : false,
		css : cssDir,
		sass: sassDir
	}))
	.pipe(pleeease({
		autoprefixer: {
			browsers: ["last 5 versions", "Firefox > 0", "Opera > 0", "ie > 7", "Chrome > 20"]
		},
		minifier: false
	}))
	.pipe(gulp.dest(cssDir));
});


//Compass
var sassDir = root + '/' + sass + '/';
var cssDir = root + '/' + css + '/';
var sassWatchFiles = sassDir + '**/*.scss';
var cssWatchFiles = cssDir + '**/*.css';
gulp.task('compass', function(){
	gulp.src([sassWatchFiles])
	.pipe(plumber())
	.pipe(compass({
		bundle_exec: true,
		config_file : 'config.rb',
		comments : false,
		css : cssDir,
		sass: sassDir
	}))
	.pipe(postcss([ autoprefixer({ browsers: ["> 0%"] }) ]))
	.pipe(gulp.dest(cssDir));
});


// sprites
var imgDir = root + '/' + img;
var spriteDir = imgDir + '/sprite';
gulp.task('sprites', function () {
	// set target folders
	var folders = getFolders(spriteDir);
	var timestamp = Date.now();

	// generate image & sass files
	folders.map(function (folder) {
		var spriteData = gulp.src('sprite/' + folder + '/*.png', {cwd: imgDir})
			.pipe(spritesmith({
				imgName: 'sprite-' + folder + '.png',
				imgPath: '../' + img + '/sprite/sprite-' + folder + '.png?' + timestamp,
				cssName: '_'+ folder + '.scss',
				algorithm: 'binary-tree',
				padding: 4,
				cssFormat: 'scss'
			}));

		spriteData.img.pipe(gulp.dest(spriteDir));
		spriteData.css.pipe(gulp.dest(sassDir + '/sprite/'));
	});
});

//CSS min
var cssDestDir = root + '/' + css + dest + '/';
gulp.task('cssmin', function(){
	gulp.src(cssWatchFiles)
	.pipe(plumber())
	.pipe(minify())
	.pipe(gulp.dest(cssDestDir));
});

//JS min
var jsWatchFiles = jsDir+ '**/*.js';
var jsNotWatchFiles = '!' + jsDir + 'components/**/*.js';
var jsDestDir = root + '/' + js + dest + '/';
gulp.task('jsmin', function(){
	gulp.src([jsWatchFiles, jsNotWatchFiles])
	.pipe(plumber())
	.pipe(uglify())
	.pipe(gulp.dest(jsDestDir));
});

//watch
gulp.task('watch', ['typescript', 'es6', 'es6Commonjs', 'typescriptCommonjs', 'compass'], function(){
	gulp.watch(typescriptWatchFiles, ['typescript']);
	gulp.watch(es6WatchFiles, ['es6']);
	gulp.watch(es6CommonjsWatchFiles, ['es6Commonjs']);
	gulp.watch(typescriptCommonjsWatchFiles, ['typescriptCommonjs']);
	gulp.watch(sassWatchFiles, ['compass']);
});

//default
gulp.task('default', ['watch']);
//min
gulp.task('min', ['cssmin','jsmin']);