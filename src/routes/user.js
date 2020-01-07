
const Router = require('koa-router')
const jwt = require('koa-jwt')

const { secret } = require('../config')
const auth = jwt({ secret })

const { login, register, info, update } = require('../controllers/users')

const usersRouter = new Router({prefix:'/user'})

usersRouter.post('/login',login)
usersRouter.post('/register',register)
usersRouter.get('/info', auth, info)
usersRouter.patch('/update', auth, update)

module.exports = usersRouter