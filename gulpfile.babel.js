import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import run from 'run-sequence';
import SourceMapSupport from 'gulp-sourcemaps-support';

const plugins = gulpLoadPlugins();

const paths = {
  js: ['src/**/*.js'],
  json: [],
  sourceRoot: path.join(__dirname, 'src'),
};

gulp.task('clean', () => {
  return del.sync(['build/**', 'build/.*']);
});

gulp.task('babel', (callback) => {
  gulp.src([...paths.js, '!gulpfile.babel.js'], { base: './src' })
    // .pipe(plugins.newer('build'))
    .pipe(SourceMapSupport())
    .pipe(plugins.sourcemaps.init())
    // .pipe(plugins.cached('babelify'))
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.', {
      includeContent: false,
      sourceRoot: (file) => {
        return paths.sourceRoot;
      },
    }))
    .pipe(gulp.dest('build'))
    .on('end', () => callback(null));
});

gulp.task('move', (callback) => {
  gulp.src(['./build/src/**/*.*'])
    .pipe(gulp.dest('build'))
    .on('end', () => {
      del.sync(['build/src/**']);
      callback(null);
    });
});

gulp.task('move-pug', () => {
  gulp.src(['src/**/*.pug'])
    .pipe(gulp.dest('build'));
});

gulp.task('nodemon', ['babel'], () => {
  plugins.nodemon({
    script: 'build/server.js',
    ext: 'js',
    watch: ['src', 'common', 'config'],
    ignore: ['node_modules/**', 'coverage/**', 'logs/**', '*.babel.js'],
    env: { NODE_ENV: process.env.NODE_ENV || 'development' },
    tasks: ['babel'],
  });
});

gulp.task('serve', ['clean'], () => run(['babel', 'move-pug']));
gulp.task('default', ['clean'], () => run('babel', 'move-pug', 'nodemon'));
gulp.task('uglify', ['uglify-vendor', 'uglify-default']);
