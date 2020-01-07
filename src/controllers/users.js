const User = require('../models/users');
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const path = require('path')

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

      new User({ 
        user_name, 
        password: hashPassword,
        avatar_url:`http://49.233.185.168:3009/avatar/${Math.floor(Math.random()*8+1)}.jpg`,
        gender: '741'
      }).save();

      ctx.body = '注册成功'
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
      if (ctx.request.files.file) {
        const basename = path.basename(ctx.request.files.file.path)
        ctx.request.body.avatar_url = `http://49.233.185.168:3009/avatar/${basename}`
      }
      const updateResult = await User.findByIdAndUpdate(
        ctx.state.user.id, 
        ctx.request.body, 
        { new: true, runValidators: true, select }
        )
      if (updateResult) ctx.body = updateResult
    }
}

module.exports = new UsersCtl()