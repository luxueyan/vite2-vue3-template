const Fontmin = require('fontmin')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const rename = require('gulp-rename')

let srcPath = path.resolve(process.cwd(), 'src/assets/_fonts/')
let distRootPath = path.resolve(process.cwd(), 'src/assets/fonts/')
const fonts = glob.sync(`${srcPath}/**/*.ttf`)

fonts.forEach((f) => {
  const fInfo = path.parse(f)
  const textFile = fInfo.dir + '/' + fInfo.name + '.js'
  if (!fs.existsSync(textFile)) return
  const text = require(textFile).text
  const distPath = path.join(distRootPath, fInfo.name)
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true })
  }
  const fontmin = new Fontmin()
    .src(f)
    .use(
      Fontmin.glyph({
        text: text,
      }),
    )
    .use(
      Fontmin.ttf2eot({
        clone: true,
      }),
    )
    .use(
      Fontmin.ttf2woff({
        clone: true,
      }),
    )
    .use(
      Fontmin.ttf2svg({
        clone: true,
      }),
    )
    .use(
      Fontmin.css({
        base64: false,
        asFileName: true,
      }),
    )
    .use(
      rename(function (path) {
        if (path.extname === '.css') {
          path.basename = 'index'
        }
      }),
    )
    .dest(distPath)
  fontmin.run(function (err, files) {
    if (err) {
      console.log(chalk.red(err))
    } else {
      console.log(chalk.green('成功生成字体文件:', fInfo.name))
    }
  })
})
