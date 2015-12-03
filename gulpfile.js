var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var sequence = require("run-sequence");
var sass = require("gulp-sass");
var del = require("del");

var dir = {
  src:      "./src",
  css:      "./css",
  html:     "./html",
  rsc:      "./rsc",
  dist:     "./dist",
};



gulp.task("default", ["build"]);

gulp.task("build", function(callback) {
  return sequence(
    "clean",
    ["js", "css", "html", "rsc"],
    callback
  );
});

gulp.task("watch", function() {
  gulp.watch(dir.src  + "/*", ["js"]);
  gulp.watch(dir.css  + "/*", ["css"]);
  gulp.watch(dir.html + "/*", ["html"]);
  gulp.watch(dir.rsc  + "/*", ["rsc"]);
});



gulp.task("clean", del.bind(null, [
  dir.dist,
]));

gulp.task("js", function() {
  return browserify({
    entries: dir.src + "/giraf.jsx",
    extensions: [".jsx", ".js"],
    debug: true,
    paths: ["./node_modules/", "./"]
  }).transform(babelify)
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest(dir.dist));
});

gulp.task("css", function() {
  return gulp.src(dir.css + "/*.scss")
    .pipe(sass())
    .pipe(gulp.dest(dir.dist));
});

gulp.task("html", function() {
  return gulp.src(dir.html + "/index.html")
    .pipe(gulp.dest(dir.dist));
});

gulp.task("rsc", function() {
  return gulp.src(dir.rsc +"/**/*")
    .pipe(gulp.dest(dir.dist + "/rsc"));
});
