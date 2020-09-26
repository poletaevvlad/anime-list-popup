const { src, dest, parallel, watch } = require('gulp');
const webpack = require('webpack-stream');
var buildSass = require('gulp-sass');

function manifest() {
  return src("src/manifest.json")
    .pipe(dest("dist"));
}

function watchManifest() {
  return watch("src/manifest.json", manifest);
}

function popupHtml() {
  return src("src/popup.html")
    .pipe(dest("dist"));
}

function watchPopupManifest() {
  return watch("src/popup.html", popupHtml);
}

function sass() {
  return src("sass/styles.sass")
    .pipe(buildSass())
    .pipe(dest("dist"));
}

function watchSass() {
  return watch("sass/**/*.sass", sass)
}

function buildJs(watch) {
  return src("src/index.ts")
    .pipe(webpack({
      mode: "development",
      watch: !!watch,
      devtool: 'source-map',
      module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
      },
      output: { filename: "index.js" }
    }))
    .pipe(dest("dist"));
}

exports.manifest = manifest;
exports.buildJs = buildJs;
exports.popupHtml = popupHtml;
exports.default = parallel(manifest, buildJs, popupHtml, sass);
exports.watch = parallel(
  watchManifest,
  watchPopupManifest,
  buildJs.bind(undefined, true),
  watchSass,
);