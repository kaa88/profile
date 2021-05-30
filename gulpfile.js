// npm i --save-dev *plugin*

const {src, dest} = require('gulp'),
	gulp = require('gulp'),
	fs = require('fs'),
	browsersync = require('browser-sync').create(),
	del = require('del'),
	rename = require('gulp-rename'),
	fileinclude = require('gulp-file-include'),
	scss = require('gulp-sass')(require('sass')),
	autoprefixer = require('gulp-autoprefixer'),
	css_media_queries = require('gulp-group-css-media-queries'),
	clean_css = require('gulp-clean-css'),
	uglify = require('gulp-uglify-es').default,
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter'),
	imageresize = require('gulp-scale-images'),
	readMetadata = require('gulp-scale-images/read-metadata'),
	through = require('through2'), // for gulp-scale-images
	imagemin = require('gulp-imagemin-changba');

const project_folder = 'dist';
const source_folder = '#src';
const path = {
	build: {
		root: project_folder + '/',
		css: project_folder + '/css/',
		js: project_folder + '/js/',
		php: project_folder + '/php/',
		libs: project_folder + '/libs/',
		img: project_folder + '/img/',
		fonts: project_folder + '/fonts/'
	},
	src: {
		html: [source_folder + '/*.html', '!' + source_folder + '/[_#]*.html'],
		scss: source_folder + '/css/style.scss',
		js: source_folder + '/js/*.js',
		php: source_folder + '/php/**/*',
		libs: source_folder + '/libs/**/*',
		// img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
		img: [source_folder + '/img/**/*', '!' + source_folder + '/img/**/*@2x.*'],
		img2x: source_folder + '/img/**/*@2x.*',
		fonts: source_folder + '/fonts/*.ttf',
		other_stuff: source_folder + '/other_stuff/**/*'
	},
	watch: {
		html: source_folder + '/**/*.html',
		scss: source_folder + '/css/**/*.scss',
		js: source_folder + '/js/**/*.js',
		php: source_folder + '/php/*.php',
		img: source_folder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
		fonts_otf: source_folder + '/fonts/otf/*.otf',
		fonts_ttf: source_folder + '/fonts/*.ttf'
	},
	clean: './' + project_folder + '/'
}

function cb() {}

function clean() {
	return del(path.clean);
}

// let html_menu_links = require('./include.json');
function html(f, file) {
	let filepath;
	if (file && !file.match(/\/[_#]/)) filepath = file;
	else filepath = path.src.html;
	return src(filepath)
		.pipe(fileinclude({
			indent: true,
			// context: html_menu_links
		}))
		.pipe(dest(path.build.root))
		.pipe(browsersync.stream());
}
function css() {
	return src(path.src.scss)
		.pipe(scss({
			outputStyle: 'expanded'
		}))
		.pipe(autoprefixer({
			overrideBrowserslist: ['last 5 versions'],
			cascade: true
		}))
		.pipe(css_media_queries())
		.pipe(dest(path.build.css))
		.pipe(clean_css())
		.pipe(rename({
			extname: '.min.css'
		}))
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream());
}
function js() {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(rename({
			extname: '.min.js'
		}))
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream());
}
function php() {
	return src(path.src.php)
		.pipe(dest(path.build.php))
		.pipe(browsersync.stream());
}
function libs() {
	return src(path.src.libs)
		.pipe(dest(path.build.libs));
}
function otherStuff() {
	return src(path.src.other_stuff)
		.pipe(dest(path.build.root));
}

const imagesScaleParams = (file, _, cb) => {
	readMetadata(file, (err, meta) => {
		if (err) return cb(err)
		file = file.clone()
		if (file.basename.match(/@2x/)) {
			file.scale = {
				maxWidth: Math.ceil(meta.width / 2),
				maxHeight: Math.ceil(meta.height / 2)
			}
		}
		else file.scale = {maxWidth: meta.width}
		cb(null, file)
	})
}
const imagesFileName = (file, scale, cb) => {
	let fileName = file.basename.replace('@2x.','.')
	cb(null, fileName)
}
function images(f, filepath) {
	let stream;
	if (filepath) {
		stream = src(filepath)
			.pipe(through.obj(imagesScaleParams))
			.pipe(imageresize(imagesFileName));
	}
	else {
		stream = src(path.src.img2x)
			.pipe(through.obj(imagesScaleParams))
			.pipe(imageresize(imagesFileName))
			.pipe(src(path.src.img2x))
			.pipe(src(path.src.img));
	}
	return stream
		.pipe(imagemin([
			imagemin.mozjpeg({quality: 75, progressive: true}),
			imagemin.optipng({optimizationLevel: 5})
		]))
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream());
}
function fonts(f, file) {
	let filepath = file ? file : path.src.fonts;
	return src(filepath)
		.pipe(ttf2woff({
			clone: true
		}))
		.pipe(dest(path.build.fonts))
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts));
}
function otf2ttf() {
	return src([source_folder + '/fonts/otf/*.otf'])
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(dest([source_folder + '/fonts/']));
}
function fontsStyle() {
	let file_content = fs.readFileSync(source_folder + '/css/fontscript.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/css/fontscript.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(source_folder + '/css/fontscript.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}
function normalizeFilePath(p) {
	return p.replace(/\\/g, "/");
}
function watchFiles() {
	// gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.scss], css).on('change', browsersync.reload);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.php], php);
	gulp.watch([path.watch.fonts_otf], otf2ttf);
	// gulp.watch([path.watch.img], images);
	// gulp.watch([path.watch.fonts_ttf], fonts);
	
	let htmlwatch = gulp.watch([path.watch.html]);
	htmlwatch.on('change', function(path, stats) {
		html(undefined, normalizeFilePath(path));
	});
	htmlwatch.on('add', function(path, stats) {
		html(undefined, normalizeFilePath(path));
	});

	let imgwatch = gulp.watch([path.watch.img]);
	imgwatch.on('change', function(path, stats) {
		images(undefined, normalizeFilePath(path));
	});
	imgwatch.on('add', function(path, stats) {
		images(undefined, normalizeFilePath(path));
	});

	let fontwatch = gulp.watch([path.watch.fonts_ttf]);
	fontwatch.on('change', function(path, stats) {
		fonts(undefined, normalizeFilePath(path));
	});
	fontwatch.on('add', function(path, stats) {
		fonts(undefined, normalizeFilePath(path));
	});
}
function browserSync() {
	browsersync.init({
		server: {
			baseDir: './' + project_folder + '/'
		},
		port: 3000,
		notify: false
	})
}

let build = gulp.series(
	clean, 
	otf2ttf, 
	gulp.parallel(html, css, js, php, libs, otherStuff, images, fonts), 
	fontsStyle
);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.otf2ttf = otf2ttf;
exports.fonts = fonts;
exports.images = images;
exports.otherStuff = otherStuff;
exports.libs = libs;
exports.php = php;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;