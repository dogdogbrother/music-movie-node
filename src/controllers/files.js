const path = require('path')
const shell = require('shelljs')

class FilesCtl {
  async music(ctx) {
    if (ctx.request.files.file) {
      const fileName = path.basename(ctx.request.files.file.path)
      const shellCode = await shell.exec(`mv ./public/${fileName} ./public/music/`);
      if (!shellCode) return ctx.throw(500, '保存音乐文件失败')
      ctx.body = `./music/${fileName}`
    } else {
      ctx.throw(400, '未发现上传的音乐文件')
    }
  }
}
module.exports = new FilesCtl()