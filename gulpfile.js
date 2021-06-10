/* File: gulpfile.js */

/* ========== Paths ========== */

const devmode = true;

const projectName = "aeolidia--duckadilly",

      sourceLiquid = './**/*.liquid',
      sourceSCSSTheme = './_source/scss/build/**/*.{scss,sass}',
      sourceSCSSCheckout = './_source/scss/checkout/**/*.{scss,sass}',
      sourceJSTheme = './_source/js/theme/**/*.js',
      sourceJSVendor = './_source/js/vendor/**/*.js',

      destinationJS = './theme/assets',
      destinationCSS = './theme/assets',

      filenameCSSTheme = 'theme.css.liquid',
      filenameCSSThemeMin = 'theme.min.css.liquid',
      filenameCSSCheckout = 'checkout.css.liquid',
      filenameCSSCheckoutMin = 'checkout.min.css.liquid',
      filenameJSTheme = 'theme.js',
      filenameJSThemeMin = 'theme.min.js',
      filenameJSVendor = 'vendor.js',
      filenameJSVendorMin = 'vendor.min.js';


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


  if (devmode == true) {

    return gulp.src(sourceSCSSTheme)
      .pipe(sourcemaps.init()) // Registers sourcemaps
      .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
      .pipe(postcss([autoprefixer()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(concat(filenameCSSTheme)) // Changes the file to .liquid so Liquid tags can understand it.
      .pipe(replace('"{{', '{{'))
      .pipe(replace('}}"', '}}'))
      .pipe(gulp.dest(destinationCSS))
      .pipe(concat(filenameCSSThemeMin)) // Changes the file to .liquid so Liquid tags can understand it.
      .pipe(postcss([cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
      .pipe(gulp.dest(destinationCSS))
      ;

  }
  else {

    return gulp.src(sourceSCSSTheme)
      .pipe(sourcemaps.init()) // Registers sourcemaps
      .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
      .pipe(postcss([autoprefixer(), cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(concat(filenameCSSTheme)) // Changes the file to .liquid so Liquid tags can understand it.
      .pipe(replace('"{{', '{{'))
      .pipe(replace('}}"', '}}'))
      .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
      .pipe(gulp.dest(destinationCSS))
      ;

  }

  return gulp.src(sourceSCSSTheme)
    .pipe(sourcemaps.init()) // Registers sourcemaps
    .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
    .pipe(postcss([autoprefixer(), cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
    .pipe(concat(filenameCSSTheme)) // Changes the file to .liquid so Liquid tags can understand it.
    .pipe(replace('"{{', '{{'))
    .pipe(replace('}}"', '}}'))
    .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
    .pipe(gulp.dest(destinationCSS))
    ;

}

function checkoutStyles() {

  return gulp.src(sourceSCSSCheckout)
    .pipe(sourcemaps.init()) // Registers sourcemaps
    .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
    .pipe(postcss([autoprefixer(), cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
    .pipe(concat(filenameCSSCheckout)) // Changes the file to .liquid so Liquid tags can understand it.
    .pipe(replace('"{{', '{{'))
		.pipe(replace('}}"', '}}'))
    .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
    .pipe(gulp.dest(destinationCSS))
    // .pipe(browserSync.stream())
    ;

}

function scripts() {

  if (devmode == true) {

    return gulp.src(sourceJSTheme)
      .pipe(sourcemaps.init()) // Registers sourcemaps
      .pipe(concat(filenameJSTheme))
      .pipe(gulpif('*.js', uglify()))
      .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
      .pipe(gulp.dest(destinationJS));

  }
  else {

    return gulp.src(sourceJSTheme)
      .pipe(concat(filenameJSTheme))
      .pipe(gulp.dest(destinationJS));

  }

}

function vendorScripts() {

  return gulp.src(sourceJSVendor)
    .pipe(sourcemaps.init()) // Registers sourcemaps
    .pipe(concat(filenameJSVendor))
    .pipe(gulpif('*.js', uglify()))
    .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
    .pipe(gulp.dest(destinationJS));

}

/* ========== Watch ========== */

function watch() {

  console.log("WATCHING");
  console.log("Development Mode == " + devmode);

  gulp.watch(sourceSCSSTheme, style);
  gulp.watch(sourceSCSSCheckout, checkoutStyles);
  gulp.watch(sourceJSTheme, scripts);
  gulp.watch(sourceJSVendor, vendorScripts);

}

function build() {

  console.log("BUILDING");
  console.log("Development Mode == " + devmode);

  style();
  checkoutStyles();
  scripts();
  vendorScripts();

}

exports.watch = watch;
exports.build = build;

exports.default = watch;
