/**
 * Lint ES
 */


const gulp = require('gulp');
const esLint = require('gulp-eslint');

module.exports = function (options) {
  return () => gulp.src(`./${options.src}/js/**/*.js`)
    .pipe(esLint({
      rules: {
        'no-console': 0,
        'no-plusplus': 0,
        eqeqeq: 0,
      },
      fix: true,
      globals: [
        'google',
        'jQuery',
        'Awesomplete',
        '$',
      ],
    }))
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(esLint.format());
};
