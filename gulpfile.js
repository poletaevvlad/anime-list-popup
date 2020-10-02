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

function assets() {
  return src("assets/**/*")
    .pipe(dest("dist/assets"))
}

function watchAssets() {
  return watch("assets/**/*", assets)
}

function html() {
  return src("html/*.html").pipe(dest("dist"));
}

function watchHtml() {
  return watch("html/*.html", html);
}

function sass() {
  return src("sass/styles.sass")
    .pipe(buildSass())
    .pipe(dest("dist/assets"));
}

function watchSass() {
  return watch("sass/**/*.sass", sass)
}

function buildJs(watch) {
  return src("src/popup/index.tsx")
    .pipe(webpack({
      mode: "development",
      watch: watch,
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
    .pipe(dest("dist/popup/"));
}

exports.manifest = manifest;
exports.buildJs = buildJs;
exports.html = html;
exports.default = parallel(manifest, buildJs.bind(undefined, false), html, sass, assets);
exports.watch = parallel(
  watchManifest,
  watchHtml,
  buildJs.bind(undefined, true),
  watchSass,
  watchAssets
);