var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var sequence = require("run-sequence");
var sass = require("gulp-sass");
var del = require("del");
var packager = require("electron-packager");
var exec = require("child_process").exec;

var packageJson = require("./package.json");

var dir = {
  src:      "./src",
  css:      "./css",
  static:   "./static",
  dist:     "./dist",
  release:  "./release",
};


function buildElectronApp(callback, opt) {
  const opt_ = Object.assign({
    dir: dir.dist,
    out: dir.release,
    name: packageJson.electronName,
    arch: "all",
    platform: "all",
    version: packageJson.electronVersion,
    "app-version": packageJson.version,
    "build-version": packageJson.version,
    overwrite: true,
  }, opt);

  // include package.json
  gulp.src("./package.json")
    .pipe(gulp.dest(dir.dist));
  packager(opt_, function(err, appPath) {
    callback();
  });
}

gulp.task("default", ["build"]);

gulp.task("build", function(callback) {
  return sequence(
    "clean",
    ["js", "css", "static"],
    callback
  );
});

gulp.task("watch", function() {
  gulp.watch(dir.src  + "/*", ["js"]);
  gulp.watch(dir.css  + "/*", ["css"]);
  gulp.watch(dir.static + "/*", ["static"]);
});

gulp.task("release", [
  "release:win32",
  "release:darwin",
  "release:linux",
]);

gulp.task("release:win32", ["build"], function(callback) {
  buildElectronApp(callback, {
    platform: "win32",
    icon: dir.static + "/rsc/Giraf.ico",
  });
});

gulp.task("release:darwin", ["build"], function(callback) {
  buildElectronApp(callback, {
    platform: "darwin",
    icon: dir.static + "/rsc/Giraf.icns",
  });
});

gulp.task("release:linux", ["build"], function(callback) {
  buildElectronApp(callback, {
    platform: "linux",
  });
});


gulp.task("clean", del.bind(null, [
  dir.dist,
]));

gulp.task("js", function(callback) {
  return sequence(
    "js:bundle",
    "js:messages",
    callback
  );
});
gulp.task("js:bundle", function() {
  return browserify({
    entries: dir.src + "/giraf.jsx",
    extensions: [".jsx", ".js"],
    debug: true,
    paths: ["./node_modules/", "./"],
    transform: ["babelify", "brfs"],
  }).bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(dir.dist));
});

gulp.task("js:messages", function() {
  exec("node_modules/.bin/babel-node scripts/export-messages.js");
});

gulp.task("css", function() {
  return gulp.src(dir.css + "/*.scss")
    .pipe(sass())
    .pipe(gulp.dest(dir.dist));
});

gulp.task("static", function() {
  return gulp.src(dir.static + "/**/*")
    .pipe(gulp.dest(dir.dist));
});
