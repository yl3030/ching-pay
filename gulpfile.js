const gulp = require('gulp');
const shell = require('gulp-shell')
const fileInclude = require('gulp-file-include');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();

const port = 3000;

gulp.task('build-html', async function() {
    await gulp.src('html/*.html')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-scss', async function() {
    await gulp.src('scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-css', async function() {
    await gulp.src('css/*.css')
        .pipe(autoprefixer({ cascade: false }))
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-js', async function() {
    await gulp.src('js/**/*.*')
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('copy-assets', async function() {
    await gulp.src('assets/*.*')
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('build', gulp.series('build-html', 'build-scss', 'copy-css', 'copy-js', 'copy-assets'));

gulp.task('watch', function() {
    const watchSrcFolders = ['html/**', 'scss/**', 'css/**', 'js/**'/*, 'assets/**'*/];
    browserSync.init({ server: "./dist", port });
    gulp.watch(watchSrcFolders, gulp.series('build'));
    gulp.watch(['dist/*.html', 'dist/js/**', 'dist/css/*.css'], { events: ["add", "change"], delay: 1000 }).on('change', browserSync.reload);
});

gulp.task('server', gulp.series(shell.task([
    `http-server --port ${port} ./dist`
])));

// dev server
gulp.task('dev', gulp.series('build', 'watch'));

// demo server
gulp.task('start', gulp.series('build', 'server'));

gulp.task('deploy-init', gulp.series(shell.task([
    'firebase init'
])));

gulp.task('deploy', gulp.series('build', shell.task([
    'firebase deploy'
])));
