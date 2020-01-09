const path = require('path')

class UsersCtl {
    async picture(ctx) {
      if (ctx.request.files.file) {
        ctx.body = path.basename(ctx.request.files.file.path)
      } else {
        ctx.throw(400, '上传图片失败')
      }
    }
}
module.exports = new UsersCtl()