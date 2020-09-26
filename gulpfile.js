const { src, dest } = require('gulp');
const webpack = require('webpack-stream');

function manifest() {
  return src("src/manifest.json")
    .pipe(dest("dist"));
}

function popupHtml() {
  return src("src/popup.html")
    .pipe(dest("dist"));
}

function buildJs() {
  return src("src/index.ts")
    .pipe(webpack({
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