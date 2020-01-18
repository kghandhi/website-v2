'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var stylish = require('jshint-stylish');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var fileinclude = require('gulp-file-include');
var autoprefixer = require('gulp-autoprefixer');
var runSequence = require('run-sequence');
var zip = require('gulp-zip');
var bs = require('browser-sync').create();
var rimraf = require('rimraf'); 
var gm = require('gulp-gm');

var path = {
    src : { 
        // source
        html : 'src/*.html',
        others : 'src/*.+(php|ico|png)',
        htminc : 'src/partials/**/*.htm',
        incdir : 'src/partials/',
        plugins : 'src/plugins/**/*.*',
        js : 'src/js/*.js',
        scss : 'src/scss/**/*.scss',
        images : 'src/images/**/*.+(png|jpg|gif|svg|pdf)',
        doc : 'documentation/**/*.*',
        blur 	 : 'src/images/**/*.jpg'
    },
    build : { 
        dirDev : 'public/template/'
    }
};

function browserSync(done) {
  bs.init({
    server: {
      baseDir: path.build.dirDev
    },
    port: 3001
  });
  done();
}

function browserSyncReload(done) {
  bs.reload();
  done();
}

var template = {
  version: {
    free: 'free',
  }
};

/* =====================================================
Development Builds
===================================================== */

// HTML
function html() {
  return gulp.src(path.src.html)
    .pipe(customPlumber('Error Running html-include'))
    .pipe(fileinclude({
      basepath: path.src.incdir, context: {
        version: template.version.free
      }
    }))
    .pipe(gulp.dest(path.build.dirDev))
    .pipe(bs.reload({
      stream: true
    }));
}

// SCSS
function scss() {
  var ignoreNotification = false;
  return gulp.src(path.src.scss)
    .pipe(customPlumber('Error Running Sass'))
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('/maps'))
    .pipe(gulp.dest(path.build.dirDev + 'css/'))
    .pipe(bs.reload({
      stream: true
    }));
}

// Javascript
//
function js() {
  return gulp.src(path.src.js)
    .pipe(customPlumber('Error Running JS'))
    .pipe(jshint('./.jshintrc'))
    .pipe(notify(function (file) {
      if (!file.jshint.success) {
        return file.relative + " (" + file.jshint.results.length + " errors)\n";
      }
    }))
    .pipe(jshint.reporter('jshint-stylish'))
    .on('error', gutil.log)
    .pipe(gulp.dest(path.build.dirDev + 'js/'))
    .pipe(bs.reload({
      stream: true
    }));
}
// Images
function images() {
  return gulp.src(path.src.images)
    .pipe(gulp.dest(path.build.dirDev + 'images/'))
    .pipe(bs.reload({
      stream: true
    }));
}

// Plugins
function plugins() {
  return gulp.src(path.src.plugins)
    .pipe(gulp.dest(path.build.dirDev + 'plugins/'))
    .pipe(bs.reload({
      stream: true
    }));
}


// Other files like favicon, php, apple-icon on root directory
function others() {
  return gulp.src(path.src.others)
    .pipe(gulp.dest(path.build.dirDev))
}

// Error Message Show
function customPlumber(errTitle) {
  return plumber({
    errorHandler: notify.onError({
      // Customizing error title
      title: errTitle || "Error running Gulp",
      message: "Error: <%= error.message %>",
      sound: "Glass"
    })
  });
}

// Clean Build Folder
function clean(cb) {
  rimraf('./builds', cb);
}


// Watch Task
function watchFiles() {
  gulp.watch(path.src.html, html);
  gulp.watch(path.src.htminc, html);
  gulp.watch(path.src.scss, scss);
  gulp.watch(path.src.js, js);
  gulp.watch(path.src.images, images);
  gulp.watch(path.src.plugins, plugins);
}

const vendor = gulp.series(clean, plugins);
const build = gulp.series(vendor, gulp.parallel(others, html, images, scss, js));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

exports.html = html;
exports.scss = scss;
exports.js = js;
exports.images = images;
exports.plugins = plugins;
exports.others = others;
exports.clean = clean;
exports.watch = watch;
exports.build = build;
exports.vendor = vendor;
// 'use strict';
//
// var gulp         = require('gulp');
// var sass         = require('gulp-sass');
// var gutil        = require('gulp-util');
// var jshint       = require('gulp-jshint');
// var sourcemaps   = require('gulp-sourcemaps');
// var uglify       = require('gulp-uglify');
// var stylish      = require('jshint-stylish');
// var plumber      = require('gulp-plumber');
// var notify       = require('gulp-notify');
// var fileinclude  = require('gulp-file-include');
// var autoprefixer = require('gulp-autoprefixer');
// var runSequence  = require('run-sequence');
// var zip          = require('gulp-zip');
// var bs           = require('browser-sync').create();
// var rimraf       = require('rimraf'); 
// var gm 			     = require('gulp-gm');
//
// var path = {
//     src: { 
//         // source
//         html    : 'src/*.html',
//         others  : 'src/*.+(php|ico|png)',
//         htminc  : 'src/partials/**/*.htm',
//         incdir  : 'src/partials/',
//         plugins : 'src/plugins/**/*.*',
//         js      : 'src/js/*.js',
//         scss    : 'src/scss/**/*.scss',
//         images  : 'src/images/**/*.+(png|jpg|gif|svg)',
//         doc     : 'documentation/**/*.*',
//         blur 	  : 'src/images/**/*.jpg'
//     },
//     build: { 
//         dirDev        : 'public/template/'
//     }
// };
//
// function browserSync(done) {
//   bs.init({
//     server: {
//       baseDir: path.build.dirDev
//     },
//     port: 3001
//   });
//   done();
// }
//
// var template = {
//   version: {
//     free: 'free',
//   }
// };
//
// /* =====================================================
// Development Builds
// ===================================================== */
//
// // HTML
// function html() {
//   return gulp.src(path.src.html)
//     .pipe(customPlumber('Error Running html-include'))
//     .pipe(fileinclude({
//       basepath: path.src.incdir, context: {
//         version: template.version.free
//       }
//     }))
//     .pipe(gulp.dest(path.build.dirDev))
//     .pipe(bs.reload({
//       stream: true
//     }));
// }
//
// gulp.task('html:build', function () {
//   return gulp.src(path.src.html)
//     .pipe(customPlumber('Error Running html-include'))
//     .pipe(fileinclude({
//       basepath: path.src.incdir, context: {
//         version: template.version.free
//       }
//     }))
//     .pipe(gulp.dest(path.build.dirDev))
//     .pipe(bs.reload({
//       stream: true
//     }));
// });
//
// // SCSS
// function scss() {
//   var ignoreNotification = false;
//   return gulp.src(path.src.scss)
//     .pipe(customPlumber('Error Running Sass'))
//     .pipe(sourcemaps.init())
//     .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
//     .pipe(autoprefixer())
//     .pipe(sourcemaps.write('/maps'))
//     .pipe(gulp.dest(path.build.dirDev + 'css/'))
//     .pipe(bs.reload({
//       stream: true
//     }));
// }
//
// gulp.task('scss:build', function () {
//   var ignoreNotification = false;
//   return gulp.src(path.src.scss)
//     .pipe(customPlumber('Error Running Sass'))
//     .pipe(sourcemaps.init())
//     .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
//     .pipe(autoprefixer())
//     .pipe(sourcemaps.write('/maps'))
//     .pipe(gulp.dest(path.build.dirDev + 'css/'))
//     .pipe(bs.reload({
//       stream: true
//     }));
// });
//
// // Javascript
// //
// function js() {
//   return gulp.src(path.src.js)
//     .pipe(customPlumber('Error Running JS'))
//     .pipe(jshint('./.jshintrc'))
//     .pipe(notify(function (file) {
//       if (!file.jshint.success) {
//         return file.relative + " (" + file.jshint.results.length + " errors)\n";
//       }
//     }))
//     .pipe(jshint.reporter('jshint-stylish'))
//     .on('error', gutil.log)
//     .pipe(gulp.dest(path.build.dirDev + 'js/'))
//     .pipe(bs.reload({
//       stream: true
//     }));
// }
// gulp.task('js:build', function () {
//   return gulp.src(path.src.js)
//     .pipe(customPlumber('Error Running JS'))
//     .pipe(jshint('./.jshintrc'))
//     .pipe(notify(function (file) {
//       if (!file.jshint.success) {
//         return file.relative + " (" + file.jshint.results.length + " errors)\n";
//       }
//     }))
//     .pipe(jshint.reporter('jshint-stylish'))
//     .on('error', gutil.log)
//     .pipe(gulp.dest(path.build.dirDev + 'js/'))
//     .pipe(bs.reload({
//       stream: true
//     }));
// });
//
// // Images
// function images() {
//   return gulp.src(path.src.images)
//     .pipe(gulp.dest(path.build.dirDev + 'images/'))
//     .pipe(bs.reload({
//       stream: true
//     }));
// }
//
// gulp.task('images:build', function () {
//   return gulp.src(path.src.images)
//     .pipe(gulp.dest(path.build.dirDev + 'images/'))
//     .pipe(bs.reload({
//       stream: true
//     }));
// });
//
// // Plugins
// function plugins() {
//   return gulp.src(path.src.plugins)
//     .pipe(gulp.dest(path.build.dirDev + 'plugins/'))
//     .pipe(bs.reload({
//       stream: true
//     }));
// }
// gulp.task('plugins:build', function () {
//   return gulp.src(path.src.plugins)
//     .pipe(gulp.dest(path.build.dirDev + 'plugins/'))
//     .pipe(bs.reload({
//       stream: true
//     }));
// });
//
// // Other files like favicon, php, apple-icon on root directory
// function others() {
//   return gulp.src(path.src.others)
//     .pipe(gulp.dest(path.build.dirDev))
// }
// gulp.task('others:build', function () {
//   return gulp.src(path.src.others)
//     .pipe(gulp.dest(path.build.dirDev))
// });
//
// // Error Message Show
// function customPlumber(errTitle) {
//   return plumber({
//     errorHandler: notify.onError({
//       // Customizing error title
//       title: errTitle || "Error running Gulp",
//       message: "Error: <%= error.message %>",
//       sound: "Glass"
//     })
//   });
// }
//
// // Clean Build Folder
// function clean() {
//   rimraf('./builds', cb);
// }
//
// gulp.task('clean', function (cb) {
//   rimraf('./builds', cb);
// });
//
// // Watch Task
// function watch() {
//   gulp.watch(path.src.html, ['html:build']);
//   gulp.watch(path.src.htminc, ['html:build']);
//   gulp.watch(path.src.scss, ['scss:build']);
//   gulp.watch(path.src.js, ['js:build']);
//   gulp.watch(path.src.images, ['images:build']);
//   gulp.watch(path.src.plugins, ['plugins:build']);
// }
// gulp.task('watch:build', function () {
//   gulp.watch(path.src.html, ['html:build']);
//   gulp.watch(path.src.htminc, ['html:build']);
//   gulp.watch(path.src.scss, ['scss:build']);
//   gulp.watch(path.src.js, ['js:build']);
//   gulp.watch(path.src.images, ['images:build']);
//   gulp.watch(path.src.plugins, ['plugins:build']);
// });
//
// // const vendor = gulp.series(clean, plugins)
// // // Build Task
// // function build() {
// //   gulp.series()
// // }
//
// const vendor = gulp.series(clean, plugins);
// const build = gulp.series(vendor, gulp.parallel(others, html, images, scss, js));
// const watch = gulp.series(build, gulp.parallel(watch, browserSync));
//
// gulp.task('build', function () {
//   runSequence(
//     'clean',
//     'html:build',
//     'js:build',
//     'scss:build',
//     'images:build',
//     'plugins:build',
//     'others:build',
//     'watch:build',
//     function () {
//       bs.init({
//         server: {
//           baseDir: path.build.dirDev,
//         }
//       });
//     }
//   );
// });
//
// gulp.task("default", ["build"]);
// exports.scss = scss;
// exports.js = js;
// exports.plugins = plugins;
// exports.html = html;
// exports.clean = clean;
//
//
// // /* =====================================================
// // Free Builds
// // ===================================================== */
// // // HTML
// // gulp.task('html:free:build', function() {
// //   return gulp.src( path.src.html )
// //     .pipe(customPlumber('Error Running html-include'))
// //     .pipe(fileinclude({ basepath: path.src.incdir, context: {
// //       version: template.version.free
// //     } }))
// //     .pipe(gulp.dest( path.build.dir ));
// // });
// //
// // // SCSS
// // gulp.task('scss:free:build', function () {
// //   var ignoreNotification = false;
// //   return gulp.src(path.src.scss)
// //     .pipe(customPlumber('Error Running Sass'))
// //     .pipe(sourcemaps.init())
// //     .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
// //     .pipe(autoprefixer())
// //     .pipe(sourcemaps.write('/maps'))
// //     .pipe(gulp.dest(path.build.dir + 'css/'));
// // });
// //
// // // Javascript
// // gulp.task('js:free:build', function () {
// //   return gulp.src(path.src.js)
// //     .pipe(customPlumber('Error Running JS'))
// //     .pipe(jshint('./.jshintrc'))
// //     .pipe(notify(function (file) {
// //       if (!file.jshint.success) {
// //         return file.relative + " (" + file.jshint.results.length + " errors)\n";
// //       }
// //     }))
// //     .pipe(jshint.reporter('jshint-stylish'))
// //     .on('error', gutil.log)
// //     .pipe(gulp.dest(path.build.dir + 'js/'));
// // });
// //
// // // Images
// // gulp.task('images-blur:free:build', function () {
// //   return gulp.src(path.src.blur)
// //     .pipe(gm(function (gmfile) {
// //       return gmfile.blur(30, 30);
// //     }))
// //     .pipe(gulp.dest(path.build.dir + 'images/'))
// //     .pipe(bs.reload({
// //       stream: true
// //     }));
// // });
// //
// // gulp.task('images:free:build', function () {
// //   return gulp.src(path.src.images)
// //     .pipe(gulp.dest(path.build.dir + 'images/'));
// // });
// //
// // // Plugins
// // gulp.task('plugins:free:build', function () {
// //   return gulp.src(path.src.plugins)
// //     .pipe(gulp.dest(path.build.dir + 'plugins/'))
// // });
// //
// // // Other files like favicon, php, apple-icon on root directory
// // gulp.task('others:free:build', function () {
// //   return gulp.src(path.src.others)
// //     .pipe(gulp.dest(path.build.dir))
// // });
// //
// // // Zipping
// // gulp.task('free-zip', function () {
// //   return gulp.src(path.build.dir + '/**/*.*')
// //     .pipe(zip('free.zip'))
// //     .pipe(gulp.dest('./builds'))
// // });
// //
// // // Build Task
// // gulp.task('free', function () {
// //   runSequence(
// //     'html:free:build',
// //     'js:free:build',
// //     'scss:free:build',
// //     'images:free:build',
// //     'images-blur:free:build',
// //     'plugins:free:build',
// //     'free-zip'
// //   );
// // });
// //
//
// exports.html = html;
