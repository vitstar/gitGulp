var gulp           = require('gulp'),
	wiredep        = require('wiredep').stream,
	useref         = require('gulp-useref'),
    gulpif         = require('gulp-if'),
    uglify         = require('gulp-uglify'),
    minifyCss      = require('gulp-minify-css'),
    clean          = require('gulp-clean'),
    sftp           = require('gulp-sftp'),
    sass           = require('gulp-sass'),
    browserSync    = require('browser-sync'),
    autoprefixer   = require('gulp-autoprefixer');


// Подключение плагинов


// Указываем browserSync какую папку отслежевать
gulp.task('browserSync', function() {
  browserSync({
        server: {
            baseDir: "app"
        },
        notify: false
    });
});

// Обработчик scss в css
gulp.task('css', function() {
    gulp.src('app/sass/*.scss')
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream: true}));
});

// Очищаем пааку продакшена 
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});
// Указывает куда сохранять и прописывать пути для установки пакетов через bower
gulp.task('bower', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({
      directory : "app/bower_conponents"
    }))
    .pipe(gulp.dest('./app'));
});

//************  Начало работы над проектом  *************//

// Указывает за какими файлами и папками следить для Автообновления браузера
gulp.task('watch', function() {
    gulp.watch('app/sass/*.scss', ['css']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    gulp.watch('bower.json', browserSync.reload);
});
gulp.task('default', ['browserSync', 'watch', 'css','bower']);

//************  Вывод на продакшен  *************//

// Формирует проект для продакшена
gulp.task('build', ['clean'], function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));

});

// Sftp
gulp.task('deploy', function () {
    return gulp.src('dist/**/*')
        .pipe(sftp({
            host: '',
            user: '',
            pass: '',
            remotePath: ''
        }));

});
