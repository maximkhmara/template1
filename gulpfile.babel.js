"use strict";

import gulp from "gulp";
import webpack from "webpack";
import webpackStream from "webpack-stream";
import dartSass from "sass";
import gulpSass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import sourcemaps from "gulp-sourcemaps";
import connect from "gulp-connect";
import nunjucks from "gulp-nunjucks";
import inject from "gulp-inject-string";
import log from "fancy-log";
import svgmin from "gulp-svgmin";
import del from "del";

const sass = gulpSass(dartSass);

const webpackConfig = require("./webpack.config.js");

gulp.task("styles", () => {
  return gulp
    .src(["./src/styles/*.scss"])
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./dist/styles"))
    .pipe(connect.reload());
});

gulp.task("html", () => {
  const datum = new Date();
  const timestamp = datum.getTime() / 1000;

  return gulp
    .src("./src/html/**/[^_]*.html")
    .pipe(nunjucks.compile({}, { trimBlocks: true, lstripBlocks: true }))
    .pipe(inject.after('src="/js/main.js', "?" + timestamp))
    .pipe(inject.after('href="/styles/main.css', "?" + timestamp))
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload());
});

gulp.task("watch", function (done) {
  gulp.watch("./src/styles/**/*.scss", gulp.series("styles"));
  gulp.watch("./src/html/**/*.html", gulp.series("html"));
  gulp.watch("./src/js/**/*.js", gulp.series("js"));
  gulp.watch(
    "./static/images/**/*.{jpg,png,jpeg,svg,gif}",
    gulp.series("copy")
  );
  gulp.watch("./static/fonts/**/*.{ttf,eot,woff,woff2}", gulp.series("copy"));
  gulp.watch("./static/models/**/*.*", gulp.series("copy"));
  gulp.watch("./static/lib/**/*", gulp.series("copy"));

  done();
});

gulp.task("serve", function (done) {
  connect.server({
    root: "./dist",
    livereload: true,
    host: "0.0.0.0",
  });

  done();
});

gulp.task("js", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest("./dist/js/"))
    .pipe(connect.reload());
});

gulp.task("svg", function () {
  return gulp
    .src("./src/images/svg/**/*.svg")
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
        plugins: [
          {
            removeXMLProcInst: false,
          },
          {
            removeDoctype: false,
          },
          {
            removeDesc: true,
          },
          {
            cleanupIDs: true,
          },
          {
            mergePaths: false,
          },
        ],
      })
    )
    .pipe(gulp.dest("./dist/images/svg"));
});

gulp.task("copy:img", function () {
  return gulp
    .src(["./static/images/**/*.{jpg,png,jpeg,svg,gif,pdf}"])
    .pipe(gulp.dest("./dist/images/"));
});

gulp.task("copy:fonts", function () {
  return gulp
    .src(["./static/fonts/**/*.{ttf,eot,woff,woff2}"])
    .pipe(gulp.dest("./dist/fonts/"));
});

gulp.task("copy:models", function () {
  return gulp.src(["./static/models/**/*.*"]).pipe(gulp.dest("./dist/models/"));
});

gulp.task("copy:root", function (done) {
  gulp.src("./static/*.*").pipe(gulp.dest("./dist/"));

  gulp.src("./static/lib/**/*").pipe(gulp.dest("./dist/jslib"));

  done();
});

gulp.task("copy:watch", function () {
  gulp.watch("./static/images/**/*.{jpg,png,jpeg,svg,gif,pdf,webm}", ["copy"]);
});

gulp.task("clean", function (cb) {
  return del(["./dist/*"]).then(function (paths) {
    log("Deleted: " + paths.join("\n"));
  });
});

gulp.task(
  "copy",
  gulp.series("copy:img", "copy:fonts", "copy:models", "copy:root")
);
gulp.task("build", gulp.series("clean", "copy", "html", "styles", "js"));

const defaultTasks = gulp.parallel("html", "styles", "serve", "js", "watch");

export default defaultTasks;
