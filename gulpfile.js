var gulp = require('gulp'),
	karma = require('karma').server,
	fs = require('fs'),
	path = require('path'),
	sass = require('gulp-ruby-sass'),
	shell = require('gulp-shell'),
	eslint = require('gulp-eslint'),
	madge = require('madge'),
	colors = require('colors'),
	sass = require('gulp-ruby-sass');

var files = [
		'app/src/**/*.js',
		'app/src/**/*.jsx',
		'!app/src/b3/src/*.js',
		'!app/src/b3/b3.js',
		'!app/src/vendor/**/*',
		'app/views/tooltips/**/*.js'
	],
	testFiles = files.concat(['test/map.spec.js']);//files.concat(['test/**/*.spec.js']);

gulp.task('sass', function () {
	gulp.src('app/styles/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./.tmp/styles'));
});

/**
 * Run test once and exit
 */
gulp.task('test', function () {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true,
		autoWatch: false
	});
});

/**
 * Run test once and exit
 */
gulp.task('test-watcher', function (done) {
	karma.start({
		configFile: __dirname + '/karma.conf.js',
	}, done);
});

gulp.task('test-watch', function() {
	gulp.watch(testFiles, ['test-watcher']);
});

gulp.task('watch', function() {
	// watch scss files
	gulp.watch('app/styles/**/*.scss', function() {
		gulp.run('sass');
	});

	gulp.watch(files, ['eslint', 'circular-dependencies-check']);
});


var folders = require('./app/sprites/directory'),
	spriteDirectory = 'app/sprites/',
	spriteProcesses = folders.map(function (folderName) {
		return 'TexturePacker --data ' + spriteDirectory + folderName + '.json --format json --sheet ' + spriteDirectory + folderName + '.png ' +
			spriteDirectory + folderName +  ' --png-opt-level 0 --algorithm MaxRects' +
			' --basic-sort-by best --trim-mode None --trim-sprite-names --ignore-files *.psd';
	});

gulp.task('sprites-process', shell.task(spriteProcesses));

gulp.task('sprites-post-process', ['sprites-process'], function () {
	folders.forEach(function (folderName) {
		var filePath = path.join(__dirname, spriteDirectory + folderName + '.json');

		fs.readFile(filePath, {
			encoding: 'utf-8'
		}, function (error, data) {
			if (error) {
				return console.error(error);
			}
			// Get rid of everything between a " and a /
			data = data.replace(/(")("?.)*?(\/)/g, '"');
			// HACK. We should improve our regex instead of reversing damage done by the bad one
			data = data.replace(/("\/www.codeandweb.com\/texturepacker",)/g, '');
			fs.writeFile(filePath, data, {
				encoding: 'utf-8'
			}, function (error) {
				if (error) {
					console.error('Error writing over the sprite output json.');
				}
			});
		});
	});
});
gulp.task('sprites-run', ['sprites-process', 'sprites-post-process']);
gulp.task('sprites-watch', function () {
	gulp.watch('app/sprites/**/*.png', ['sprites-run']);
});

gulp.task('eslint', function () {
	return gulp.src(files)
		.pipe(eslint())
		.pipe(eslint.format());
});
gulp.task('circular-dependencies-check', function () {
	var circular = madge('app/src').circular().getArray();
	if (circular.length) {
		console.log('Oh no we got circular dependencies!'.red);
		console.log(colors.blue(circular));
	}
});

gulp.task('default', ['sass', 'test', 'watch']);
gulp.task('sprites', ['sprites-run', 'sprites-watch']);
