const Router = require('koa-router')
const jwt = require('koa-jwt')

const { secret } = require('../config')
const auth = jwt({ secret })

const { addComment, comment, upDowen, subComment } = require('../controllers/comment')

const usersRouter = new Router({prefix:'/comment'})

usersRouter.post('/:plazaId', auth, addComment)
usersRouter.get('/:plazaId', auth, comment)
usersRouter.get('/:plazaId/:commentId/sub_comment', auth, subComment)
usersRouter.put('/:id', auth, upDowen)

module.exports = usersRouter