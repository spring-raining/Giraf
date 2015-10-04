var gulp = require("gulp");
var browserify = require("browserify");
var babelify = require("babelify");
var source = require("vinyl-source-stream");
var sass = require("gulp-sass");

gulp.task("default", ["browserify", "sass"]);

gulp.task("browserify", function() {
  return browserify({
    entries: "./src/giraf.jsx",
    extensions: [".jsx", ".js"],
    debug: true,
    paths: ["./node_modules/", "./"]
  }).transform(babelify)
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("./"));
});

gulp.task("sass", function() {
  return gulp.src("./css/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./"));
});
