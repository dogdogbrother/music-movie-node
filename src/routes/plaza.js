const Router = require('koa-router')
const jwt = require('koa-jwt')

const { secret } = require('../config')
const auth = jwt({ secret })

const { publish, list, upDowen} = require('../controllers/plaza')

const usersRouter = new Router({prefix:'/plaza'})

usersRouter.post('/publish', auth, publish)
usersRouter.get('/', auth, list)
usersRouter.put('/:id', auth, upDowen)

module.exports = usersRouter