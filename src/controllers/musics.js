const path = require('path')
const shell = require('shelljs')
const Music = require('../models/musics');

class FilesCtl {
  async upload(ctx) {
    const { song_url } = ctx.request.body
    const songResult = await Music.findOne({ song_url })
    if (songResult) return ctx.throw(409, '保存失败,已存在相同路径文件')
    ctx.request.body.upload_user = ctx.state.user.id
    const user = await new Music(ctx.request.body).save();
    if (user) ctx.body = '上传成功'
  }
}

module.exports = new FilesCtl()