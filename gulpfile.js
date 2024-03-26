const gulp = require('gulp');
const less = require('gulp-less');
const del = require('del');
const rename = require("gulp-rename");
const cleanCss = require("gulp-clean-css");
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const autoPrefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const size =  require('gulp-size');
const newer = require('gulp-newer');
const paths = {
    html:{
        src:'src/*.html',
        dest:'dist/'
    },
    styles: {
        src: "src/styles/**/*.less",
        dest: 'dist/css/'
    },
    scripts: {
        src: "src/scripts/**/*.js",
        dest: 'dist/js/'
    },
    images:{
        src:'src/images/**',
        dist:'dist/images/'
    }
};

function clean(){
    return del(['dist/*','!dist/images'])
}



function html(){
    return gulp.src(paths.html.src)
    .pipe(sourcemaps.init())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(sourcemaps.write('.'))
    .pipe(size({showFiles:true}))
    .pipe(gulp.dest(paths.html.dest));
}

function img(){
    return gulp.src(paths.images.src)
    .pipe(newer(paths.images.dist))
    .pipe(imagemin({
        progressive:true
    }))
    .pipe(size({showFiles:true}))
    .pipe(gulp.dest(paths.images.dist))
}
 
function styles(){
    return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(less({
        plugins:[]
    }))
    .pipe(autoPrefixer({cascade:true}))
    .pipe(cleanCss({
        level:2
    }))
    .pipe(concat('main.min.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(size({showFiles:true}))
    .pipe(gulp.dest(paths.styles.dest))
}

function watch() {
    gulp.watch(paths.styles.src,styles);
    gulp.watch(paths.scripts.src,scripts);
    gulp.watch(paths.html.src,html);
    gulp.watch(paths.images.src,img);

}

function scripts(){
    return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(babel(
        {presets:['@babel/env']}
    ))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(size({showFiles:true}))
    .pipe(gulp.dest(paths.scripts.dest)) 
}

const build = gulp.series(clean,html, gulp.parallel(styles,scripts,img),watch);

exports.clean = clean;
exports.styles = styles;
exports.watch = watch;
exports.img = img;
exports.html = html;
exports.build = build;
exports.default = build;
exports.scripts = scripts;
