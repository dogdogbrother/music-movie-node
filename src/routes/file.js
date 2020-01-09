// 用于处理文件相关的接口的
const Router = require('koa-router')
const jwt = require('koa-jwt')

const { secret } = require('../config')
const auth = jwt({ secret })

const { picture } = require('../controllers/files')

const usersRouter = new Router({prefix:'/file'})

usersRouter.post('/picture', auth, picture)


module.exports = usersRouter