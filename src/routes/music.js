const Router = require('koa-router')
const jwt = require('koa-jwt')

const { secret } = require('../config')
const auth = jwt({ secret })

const { upload } = require('../controllers/musics')

const usersRouter = new Router({prefix:'/music'})

usersRouter.post('/upload', auth, upload)

module.exports = usersRouter