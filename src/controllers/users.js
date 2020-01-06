const User = require('../models/users');
const bcrypt = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

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
      ctx.body = '登陆成功'
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
        avatar_url:`http://49.233.185.168:3009/avatar/${Math.floor(Math.random()*8+1)}.jpg`
      }).save();

      ctx.body = user
    }
}

module.exports = new UsersCtl()