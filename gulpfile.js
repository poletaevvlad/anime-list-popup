const { src, dest, parallel, watch, series } = require("gulp");
const webpack = require("webpack-stream");
const buildSass = require("gulp-sass")(require("sass"));
const gulpClean = require("gulp-clean");
const replace = require("gulp-replace");
const fs = require("fs");

function clean() {
  return src("dist", { read: false, allowEmpty: true }).pipe(gulpClean());
}

function manifest() {
  const packageJson = JSON.parse(fs.readFileSync("./package.json"));
  return src("src/manifest.json")
    .pipe(replace("{#VERSION#}", packageJson.version))
    .pipe(dest("dist"));
}

function watchManifest() {
  return watch("src/manifest.json", manifest);
}

function assets() {
  return src("assets/**/*").pipe(dest("dist/assets"));
}

function watchAssets() {
  return watch("assets/**/*", assets);
}

function html() {
  return src("html/*.html").pipe(dest("dist"));
}

function watchHtml() {
  return watch("html/*.html", html);
}

function sass() {
  return src("sass/styles.sass").pipe(buildSass()).pipe(dest("dist/assets"));
}

function watchSass() {
  return watch("sass/**/*.sass", sass);
}

function buildJs(watch, release) {
  return src("src/popup/index.tsx")
    .pipe(
      webpack({
        entry: {
          popup: "./src/popup/index.tsx",
          auth: "./src/auth/index.tsx",
        },
        mode: release ? "production" : "development",
        watch: watch,
        devtool: release ? undefined : "source-map",
        module: {
          rules: [
            {
              test: /\.tsx?$/,
              use: "ts-loader",
              exclude: /node_modules/,
            },
          ],
        },
        resolve: {
          extensions: [".tsx", ".ts", ".js"],
        },
        optimization: {
          minimize: false,
        },
        output: { filename: "[name].js" },
      })
    )
    .pipe(dest("dist"));
}

exports.manifest = manifest;
exports.buildJs = buildJs;
exports.html = html;
exports.clean = clean;
exports.default = parallel(
  manifest,
  buildJs.bind(undefined, false, false),
  html,
  sass,
  assets
);
exports.watch = parallel(
  watchManifest,
  watchHtml,
  buildJs.bind(undefined, true, true),
  watchSass,
  watchAssets
);
exports.release = series(
  clean,
  parallel(manifest, buildJs.bind(undefined, false, true), html, sass, assets)
);
