var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var sequence = require("run-sequence");
var sass = require("gulp-sass");
var del = require("del");
var packager = require("electron-packager");

var packageJson = require("./package.json");

var dir = {
  src:      "./src",
  css:      "./css",
  static:   "./static",
  dist:     "./dist",
  release:  "./release",
};



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

gulp.task("release", ["build"], function(callback) {
  // include package.json
  gulp.src("./package.json")
    .pipe(gulp.dest(dir.dist));

  packager({
    dir: dir.dist,
    out: "./release",
    name: packageJson.electronName,
    arch: "all",
    platform: "all",
    version: packageJson.electronVersion,
    overwrite: true,
  }, function(err, appPath) {
    callback();
  });
});


gulp.task("clean", del.bind(null, [
  dir.dist,
]));

gulp.task("js", function() {
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

gulp.task("css", function() {
  return gulp.src(dir.css + "/*.scss")
    .pipe(sass())
    .pipe(gulp.dest(dir.dist));
});

gulp.task("static", function() {
  return gulp.src(dir.static + "/**/*")
    .pipe(gulp.dest(dir.dist));
});
