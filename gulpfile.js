const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const filter = require('gulp-filter');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const rigger = require('gulp-rigger');
const rimraf = require('rimraf');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const mainBowerFiles = require('main-bower-files');
const BS = require('browser-sync');
const sftp = require('gulp-sftp');
const babel = require('gulp-babel');
const del = require('del');
// const concatCss = require('gulp-concat-css');

gulp.task('styles', (done) => {
  gulp.src('./src/scss/form.scss')
  .pipe(sass())
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  // .pipe(concatCss('app.css'))
  // .pipe(concat('app.css'))
  .pipe(gulp.dest('./static/css'));
  done();
});

gulp.task('javascripts', (done) => {
  gulp.src('src/**/*.js', 'bower_components/**/*.js')
  .pipe(concat('app.js'))
  .pipe(gulp.dest('./static/'));
  done();
});

gulp.task('views', (done) => {
  gulp.src('./src/form.html')
    .pipe(gulp.dest('./static'));
    done();
});

gulp.task('clean', () => {
  return del('static')
});

gulp.task('build', (done) => {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.static.all));
    done();
});

gulp.task('build',
  gulp.series('clean',
    gulp.parallel('views', 'styles', 'javascripts')
  )
);

gulp.task('server', () => {
  BS.init({
    server: 'static',
    port: 8080,
    ui: {
      port: 8081,
    },
  })
  BS.watch('static/**/*.*').on('change', BS.reload)
})

var site = {
  host:"",
  user:"",
  pass:"",
  port:"",
  remotePath:""
};

gulp.task('sftp', (done) => {
  gulp.src(path.static.all)
    .pipe(sftp({
        host: site.server,
        user: site.user,
        pass: site.pass,
        port: site.port,
        remotePath:site.folder
    }));
    done();
});

gulp.task('watch', () => {
  gulp.watch('./src/styles/**/*.scss', gulp.series('styles'))
  gulp.watch('./src/**/*.html', gulp.series('views'))
  gulp.watch('./src/js/**/*.js', gulp.series('javascripts'))
  // gulp.watch('./bower_components/js/**/*.js', gulp.series('javascripts'))
});

gulp.task('default', gulp.series('build', gulp.parallel( 'server', 'watch')))
