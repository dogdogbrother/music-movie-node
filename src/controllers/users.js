const User = require('../models/users');
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const path = require('path')
const shell = require('shelljs')

const { secret } = require('../config')

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

      const { avatar_url } = ctx.request.body
      if (avatar_url) {
        const shellCode = await shell.exec(`mv ./public/${avatar_url} ./public/avatar_user/`);
        if (!shellCode) {
          return ctx.throw(500, '保存用户头像失败')
        }
        ctx.request.body.avatar_url = `./avatar_user/${avatar_url}`
      }
      const updateResult = await User.findByIdAndUpdate(
        ctx.state.user.id, 
        ctx.request.body, 
        { new: true, runValidators: true, select }
        )
      if (updateResult) return ctx.body = updateResult
      ctx.throw(500, '服务器内部错误')
    }
}

module.exports = new UsersCtl()