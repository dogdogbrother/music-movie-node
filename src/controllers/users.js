const User = require('../models/users');
const Music = require('../models/musics');
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const path = require('path')
const shell = require('shelljs')
const { secret } = require('../config')
const { returnPaging } = require('../utils')

class UsersCtl {

  async login(ctx) {
    ctx.verifyParams({
      user_name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    })
    const { user_name, password } = ctx.request.body;
    const findUser = await User.findOne({ user_name }).select("+password");
    if (!findUser || !bcrypt.compareSync(password, findUser.password)) {
      ctx.throw(401, '用户名或密码错误')
    }

    const token = jsonwebtoken.sign({ id: findUser._id, user_name  }, secret, { expiresIn: '7d' })
    
    ctx.cookies.set('jwt', token, { maxAge: 604800000 })
    // ctx.body = '登陆成功'
    ctx.body = token
  }

  async register(ctx) {
    ctx.verifyParams({
      user_name: { type: 'string', required: true },
      password: { type: 'string', required: true },
    })
    const { user_name, password } = ctx.request.body;
    const findUser = await User.findOne({ user_name });
    if (findUser) { ctx.throw(409, '用户已经存在,请更换用户名') }
    const salt = bcrypt.genSaltSync(10);
    var hashPassword = bcrypt.hashSync(password, salt);

    const user = await new User({ 
      user_name, 
      password: hashPassword,
      avatar_url:`./avatar_default/${Math.floor(Math.random()*8+1)}.jpg`
    }).save();
    if(user) {
      ctx.body = '注册成功'
    } else{
      ctx.throw(500, '服务器内部错误')
    }
  }

  async info(ctx) { 
    const { fields } = ctx.query
    const selectFields = fields.split(';').filter(f => f && f !== 'password').map(f => ' +' + f ).join('')
    const findInfo = await User.findById(ctx.state.user.id).select(selectFields);
    ctx.body = findInfo
  }

  async update(ctx) {
    const { fields } = ctx.query
    const select = fields.split(';').filter(f => f && f !== 'password').map(f => ' +' + f ).join('')
    const updateResult = await User.findByIdAndUpdate(
      ctx.state.user.id, 
      ctx.request.body, 
      { new: true, runValidators: true, select }
      )
    if (updateResult) return ctx.body = updateResult
    ctx.throw(400, '更新用户资料失败')
  }

  async avatar(ctx) {
    if (ctx.request.files.file) {
      const imgPath = path.basename(ctx.request.files.file.path)
      const shellCode = await shell.exec(`mv ./public/${imgPath} ./public/avatar_user/`);
      if (!shellCode) return ctx.throw(500, '保存用户头像失败')
      const updateResult = await User.findByIdAndUpdate(
        ctx.state.user.id,
        { avatar_url : `./avatar_user/${imgPath}`},
        { new: true, runValidators: true }
      )
      if (updateResult) return ctx.body = updateResult.avatar_url
      ctx.throw(500, '服务器内部错误')
    }
  }

  async updateSongList(ctx) {
    const { pageNumber, pageSize, page_number } = returnPaging(ctx.query)
    const songList = await Music.find({ upload_user: ctx.state.user.id }).limit(pageSize).skip(pageSize*pageNumber)
    ctx.body = songList
  }

  async likesong(ctx) {
    if (!ctx.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.throw(400, 'id格式错误')
    }
    const song = await Music.findById(ctx.params.id)
    if (!song) return ctx.throw(404, '收藏失败,歌曲不存在')
    const me = await User.findById(ctx.state.user.id).select('+collectMusic')
    if(!me.collectMusic.map(id => id.toString()).includes(ctx.params.id)){
      me.collectMusic.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }
   
  async follow(ctx) {
    const me = await User.findById(ctx.state.user.id).select('+following')
    if(!me.following.map(id => id.toString()).includes(ctx.params.id)){
      me.following.push(ctx.params.id)
      me.save()
    }
    ctx.status = 204
  }

  async followList(ctx) {
    const { pageNumber, pageSize, page_number } = returnPaging(ctx.query)
    const user = await User.findById(ctx.state.user.id)
    .select('+following')
    .populate('following')
    .limit(pageSize)
    .skip(pageSize*pageNumber)
    ctx.body = user ? user.following : []
  }

  async fansList(ctx) {
    const { pageNumber, pageSize, page_number } = returnPaging(ctx.query)
    const users = await User.find({ following: ctx.state.user.id }).limit(pageSize).skip(pageSize*pageNumber)
    ctx.body = users
  }

  async likeSongList(ctx) {
    const user = await User.findById(ctx.state.user.id).select("+collectMusic").populate("collectMusic")
    ctx.body = user.collectMusic
  }

}

module.exports = new UsersCtl()