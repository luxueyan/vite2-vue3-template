let gulp = require('gulp')
let buffer = require('vinyl-buffer')
let csso = require('gulp-csso')
let imagemin = require('gulp-imagemin')
let merge = require('merge-stream')
let spritesmith = require('gulp.spritesmith')
let path = require('path')

gulp.task('sprite', function () {
  // Generate our spritesheet
  console.log(path.join(__dirname, '../src/assets/image/_sprite/*.png'))
  let spriteData = gulp.src(path.join(__dirname, '../src/assets/image/_sprite/*.png')).pipe(
    spritesmith({
      imgName: 'sprite.png',
      cssName: 'sprite.css',
      padding: 20,
    }),
  )

  // Pipe image stream through image optimizer and onto disk
  let imgStream = spriteData.img
    // DEV: We must buffer our stream into a Buffer for `imagemin`
    .pipe(buffer())
    .pipe(imagemin())
    .pipe(gulp.dest(path.join(__dirname, '../src/assets/image/sprite/')))

  // Pipe CSS stream through CSS optimizer and onto disk
  let cssStream = spriteData.css.pipe(csso()).pipe(gulp.dest(path.join(__dirname, '../src/assets/image/sprite/')))

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream)
})

// gulp.run('sprite')
