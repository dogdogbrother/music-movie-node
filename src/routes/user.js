
const Router = require('koa-router')
const { login, register } = require('../controllers/users')

const usersRouter = new Router({prefix:'/users'})

usersRouter.post('/login',login)
usersRouter.post('/register',register)

module.exports = usersRouter