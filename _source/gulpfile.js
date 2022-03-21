/* File: gulpfile.js */

/* ========== Paths ========== */

const devmode = true;

const projectName = "project-name",

      sourceLiquid = './**/*.liquid',
      sourceSCSSCustom = './scss/custom/**/*.{scss,sass}',
      sourceSCSSTheme = './scss/theme/**/*.{scss,sass}',
      sourceSCSSAccount = './scss/account/**/*.{scss,sass}',
      sourceSCSSCheckout = './scss/checkout/**/*.{scss,sass}',
      sourceSCSSMisc = './scss/misc/**/*.{scss,sass}',

      sourceJSCustom = './js/custom/**/*.js',
      sourceJSVendor =
        [
          './node_modules/jquery/dist/jquery.min.js',
          './node_modules/@shopify/theme-sections/dist/theme-sections.min.js',
          './node_modules/swiper/swiper-bundle.min.js',
          './node_modules/lazysizes/lazysizes.min.js',
          './js/vendor/**/*.js'
        ],

      destinationJS = './../assets',
      destinationCSS = './../assets',

      filenameCSSCustom = 'custom.css',
      filenameCSSCustomMin = 'custom.min.css',
      filenameCSSTheme = 'theme.css',
      filenameCSSThemeMin = 'theme.min.css',
      filenameCSSAccount = 'account.css',
      filenameCSSAccountMin = 'account.min.css',
      filenameCSSCheckout = 'checkout.css',
      filenameCSSCheckoutMin = 'checkout.min.css',

      filenameJSVendor = 'vendor.js',
      filenameJSVendorMin = 'vendor.min.js';
      filenameJSCustom = 'custom.js',
      filenameJSCustomMin = 'custom.min.js';


/* ========== Modules ========== */

const gulp = require('gulp'),
      { parallel } = require('gulp'),
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

function styleCustom() {

  if (devmode == true) {

    return gulp.src(sourceSCSSCustom)
      .pipe(sourcemaps.init()) // Registers sourcemaps
      .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
      .pipe(postcss([autoprefixer()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(concat(filenameCSSCustom))
      .pipe(gulp.dest(destinationCSS))
      .pipe(concat(filenameCSSCustomMin))
      .pipe(postcss([cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
      .pipe(gulp.dest(destinationCSS))
      ;

  }
  else {

    return gulp.src(sourceSCSSCustom)
      .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
      .pipe(postcss([autoprefixer(), cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(concat(filenameCSSCustomMin)) // Changes the file to .liquid so Liquid tags can understand it.
      .pipe(gulp.dest(destinationCSS))
      ;

  }

}

function styleTheme() {

  if (devmode == true) {

    return gulp.src(sourceSCSSTheme)
      .pipe(sourcemaps.init()) // Registers sourcemaps
      .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
      .pipe(postcss([autoprefixer()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(concat(filenameCSSTheme)) // Changes the file to .liquid so Liquid tags can understand it.
      .pipe(gulp.dest(destinationCSS))
      .pipe(concat(filenameCSSThemeMin)) // Changes the file to .liquid so Liquid tags can understand it.
      .pipe(postcss([cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
      .pipe(gulp.dest(destinationCSS))
      ;

  }
  else {

    return gulp.src(sourceSCSSTheme)
      .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
      .pipe(postcss([autoprefixer(), cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(concat(filenameCSSThemeMin)) // Changes the file to .liquid so Liquid tags can understand it.
      .pipe(gulp.dest(destinationCSS))
      ;

  }

}

function styleAccount() {

  if (devmode == true) {

    return gulp.src(sourceSCSSAccount)
      .pipe(sourcemaps.init()) // Registers sourcemaps
      .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
      .pipe(postcss([autoprefixer()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(concat(filenameCSSAccount)) // Changes the file to .liquid so Liquid tags can understand it.
      .pipe(gulp.dest(destinationCSS))
      .pipe(concat(filenameCSSAccountMin)) // Changes the file to .liquid so Liquid tags can understand it.
      .pipe(postcss([cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
      .pipe(gulp.dest(destinationCSS))
      ;

  }
  else {

    return gulp.src(sourceSCSSAccount)
      .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
      .pipe(postcss([autoprefixer(), cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(concat(filenameCSSAccount)) // Changes the file to .liquid so Liquid tags can understand it.
      .pipe(gulp.dest(destinationCSS))
      ;

  }

}

function styleMisc() {

  if (devmode == true) {

    return gulp.src(sourceSCSSMisc)
      .pipe(sourcemaps.init()) // Registers sourcemaps
      .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
      .pipe(postcss([autoprefixer()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(gulp.dest(destinationCSS))
      .pipe(postcss([cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
      .pipe(gulp.dest(destinationCSS))
      ;

  }
  else {

    return gulp.src(sourceSCSSMisc)
      .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
      .pipe(postcss([autoprefixer()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(gulp.dest(destinationCSS))
      .pipe(postcss([cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
      .pipe(gulp.dest(destinationCSS))
      ;

  }

}

function styleCheckout() {

  return gulp.src(sourceSCSSCheckout)
    .pipe(sourcemaps.init()) // Registers sourcemaps
    .pipe(sass()).on("error", sass.logError) // Logs SCSS errors succinctly to terminal.
    .pipe(postcss([autoprefixer(), cssnano()])) // Runs compiled CSS through PostCSS for post-processing.
    .pipe(concat(filenameCSSCheckout)) // Changes the file to .liquid so Liquid tags can understand it.
    .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
    .pipe(gulp.dest(destinationCSS))
    ;

}

function scriptsCustom() {

  if (devmode == true) {

    return gulp.src(sourceJSCustom)
      .pipe(sourcemaps.init()) // Registers sourcemaps
      .pipe(concat(filenameJSCustom))
      .pipe(gulpif('*.js', uglify()))
      .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
      .pipe(gulp.dest(destinationJS));

  }
  else {

    return gulp.src(sourceJSCustom)
      .pipe(concat(filenameJSCustom))
      .pipe(gulp.dest(destinationJS));

  }

}

function scriptsVendor() {

  if (devmode == true) {

    return gulp.src(sourceJSVendor)
      .pipe(sourcemaps.init()) // Registers sourcemaps
      .pipe(concat(filenameJSVendor))
      .pipe(gulp.dest(destinationJS))
      .pipe(gulpif('*.js', uglify()))
      .pipe(concat(filenameJSVendorMin))
      .pipe(sourcemaps.write('./')) // Generates sourcemaps for in-browser debugging
      .pipe(gulp.dest(destinationJS));

  }
  else {

    return gulp.src(sourceJSVendor)
      .pipe(concat(filenameJSVendorMin))
      .pipe(gulpif('*.js', uglify()))
      .pipe(gulp.dest(destinationJS));

  }

}

/* ========== Watch ========== */

function watch() {

  console.log("👀");
  console.log("Development Mode == " + devmode);

  gulp.watch(sourceSCSSTheme, styleTheme);
  gulp.watch(sourceSCSSCustom, styleCustom);
  gulp.watch(sourceSCSSAccount, styleAccount);
  gulp.watch(sourceSCSSCheckout, styleCheckout);
  gulp.watch(sourceSCSSMisc, styleMisc);

  gulp.watch(sourceJSCustom, scriptsCustom);
  gulp.watch(sourceJSVendor, scriptsVendor);

}

exports.watch = watch;
exports.scriptsVendor = scriptsVendor;

exports.build = parallel(

  styleCustom,
  styleTheme,
  styleAccount,
  styleCheckout,
  styleMisc,

  scriptsVendor,
  scriptsCustom

);

exports.default = watch;
