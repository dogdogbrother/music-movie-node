const Router = require('koa-router')
const jwt = require('koa-jwt')

const { secret } = require('../config')
const auth = jwt({ secret })

const { 
  login, 
  register, 
  info, 
  update, 
  avatar, 
  updateSongList, 
  likesong, 
  follow,
  followList,
  fansList,
  likeSongList
} = require('../controllers/users')

const usersRouter = new Router({prefix:'/user'})

usersRouter.post('/login',login)
usersRouter.post('/register',register)
usersRouter.get('/info', auth, info)
usersRouter.patch('/update', auth, update)
usersRouter.put('/avatar', auth, avatar)
usersRouter.get('/update_song_list', auth, updateSongList)
usersRouter.put('/like_song/:id', auth, likesong)
usersRouter.put('/following/:id', auth, follow)
usersRouter.get('/following', auth, followList)
usersRouter.get('/fans', auth, fansList)
usersRouter.get('/like_song_list', auth, likeSongList)

module.exports = usersRouter