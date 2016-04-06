
import gulp from 'gulp'
import babel from 'gulp-babel'
import less from 'gulp-less'
import watch from 'gulp-watch'
import gulpBrowser from 'gulp-browser'

gulp.task('babel', () => {
  gulp
    .src('src/**/*.js')
    .pipe(watch('src/**/*.js', { verbose: true }))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulp.dest('lib'))
})

gulp.task('less', () => {
  gulp
    .src('src/**/*.less')
    .pipe(watch('src/**/*.less', { verbose: true }))
    .pipe(less())
    .pipe(gulp.dest('lib'))
})

gulp.task('bundle', () => {
  gulp
    .src('src/index.js')
    .pipe(watch('src/index.js', { verbose: true }))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(gulpBrowser.browserify())
    .pipe(gulp.dest('lib'))
})
