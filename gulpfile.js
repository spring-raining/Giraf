var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");

gulp.task("default", ["build"]);

gulp.task("build", function() {
  return browserify({
    entries: "./src/giraf.jsx",
    extensions: [".jsx"],
    debug: true
  }).transform(babelify)
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./"));
});
