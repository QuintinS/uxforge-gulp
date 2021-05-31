/* File: gulpfile.js */

/* ========== Paths ========== */

const projectName = "brackish",
      projectSrcLiquid = './**/*.liquid',
      projectThemeSCSS = './_source/scss/theme/**/*.{scss,sass}',
      projectSrcSCSS = './_source/scss/build/**/*.{scss,sass}',
      projectSrcJSTheme = './_source/js/theme/**/*.js',
      projectSrcJSVendor = [
        './_source/js/vendor/vendor.js'
      ],
      projectDestJS = './theme/assets',
      projectDestCSS = './theme/assets';
      projectDestCSSFilename = 'custom-styles.css.liquid',
      projectDestJSThemeFilename = 'theme.js',
      projectDestJSVendorFilename = 'vendor.js';


/* ========== Modules ========== */

const gulp = require('gulp'),
      concat = require("gulp-concat"),
      replace = require("gulp-replace"),
      postcss = require("gulp-postcss"),
      autoprefixer = require("autoprefixer"),
      cssnano = require("cssnano"),
      sourcemaps = require("gulp-sourcemaps");
      sass = require('gulp-sass'),
      uglify = require('gulp-uglify'),
      gulpif = require('gulp-if');

/* ========== SCSS ========== */

// Styles

function style() {

  return gulp.src(projectSrcSCSS)
    .pipe(sourcemaps.init()) // Registers sourcemaps
    .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
    .pipe(postcss([autoprefixer(), cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
    .pipe(concat(projectDestCSSFilename)) // Changes the file to .liquid so Liquid tags can understand it.
    .pipe(replace('"{{', '{{'))
		.pipe(replace('}}"', '}}'))
    .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
    .pipe(gulp.dest(projectDestCSS))
    // .pipe(browserSync.stream())
    ;

}

function theme() {

  return gulp.src(projectThemeSCSS)
    .pipe(sourcemaps.init()) // Registers sourcemaps
    .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
    .pipe(postcss([autoprefixer(), cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
    .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
    .pipe(gulp.dest(projectDestCSS))
    // .pipe(browserSync.stream())
    ;

}

function scripts() {

  return gulp.src(projectSrcJSTheme)
    .pipe(sourcemaps.init()) // Registers sourcemaps
    .pipe(concat(projectDestJSThemeFilename))
    .pipe(gulpif('*.js', uglify()))
    .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
    .pipe(gulp.dest(projectDestJS));

}

function vendorScripts() {

  return gulp.src(projectSrcJSVendor)
    .pipe(sourcemaps.init()) // Registers sourcemaps
    .pipe(concat(projectDestJSVendorFilename))
    .pipe(gulpif('*.js', uglify()))
    .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
    .pipe(gulp.dest(projectDestJS));

}

/* ========== Watch ========== */

function watch() {
  gulp.watch(projectSrcSCSS, style);
  gulp.watch(projectSrcJSTheme, scripts);
  gulp.watch(projectSrcJSVendor, vendorScripts);
  gulp.watch(projectThemeSCSS, theme);
}

exports.style = style;
exports.watch = watch;
