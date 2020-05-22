const gulp = require('gulp')
const del = require('del')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const zip = require('gulp-zip')
const fs = require('fs')

gulp.task('html', done => {
  gulp.src('app/popup.html').pipe(gulp.dest('dist'))
  done()
})

gulp.task('css', done => {
  gulp.src('app/**/*.css').pipe(gulp.dest('dist'))
  done()
})

gulp.task('img', done => {
  gulp.src('app/images/**/*.png').pipe(gulp.dest('dist/images'))
  done()
})

gulp.task('json', done => {
  gulp.src('app/**/*.json').pipe(gulp.dest('dist'))
  done()
})

gulp.task('js', done => {
  gulp
    .src('app/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))

  done()
})

gulp.task('clean:dist', done => {
  del.sync('dist')
  done()
})

gulp.task('clean:zip', done => {
  del.sync('dist.zip')
  done()
})

gulp.task('clean', gulp.series(
  'clean:dist', 'clean:zip', done => {
    done()
  }
))

gulp.task('zip:dist', done => {
  if (fs.existsSync('dist/manifest.json')) {
    gulp
      .src('dist/**/*')
      .pipe(zip('dist.zip'))
      .pipe(gulp.dest('./'))
  } else {
    console.log('ERROR: Nothing to zip. Make sure you run build command first:')
    console.log('\n')
    console.log('gulp build')
    console.log('\n')
  }

  done()
})

gulp.task('build', gulp.series(
  'clean:dist', 'html', 'css', 'img', 'json', 'js', done => {
    done()
  }
))

gulp.task('zip', gulp.series(
  'clean:zip', 'zip:dist', done => {
    done()
  }
))
