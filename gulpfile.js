var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('concat', function () {
    gulp.src(['./src/cabal.js', './src/components.js', './src/mapper.js'])
        .pipe(concat('cabal.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('build', function () {
    gulp.src(['./src/cabal.js', './src/components.js', './src/mapper.js'])
        .pipe(concat('cabal.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist/'));
});
