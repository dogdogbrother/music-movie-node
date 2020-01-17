const { Schema, model, options } = require('./config')

const mongoose = require('mongoose');

const commentSchema = new Schema({
  createdAt: { type:String, select: true },
  updatedAt: { type:String, select: false },
  up: { type: [{ type: Schema.Types.ObjectId, ref:'User' }], default: [] }, // 赞的人,和动态是一样的
  down: { type: [{ type: Schema.Types.ObjectId, ref:'User' }], default: [] }, // 踩的人,和动态是一样的
  img: { type: [{ type:String }], default:[], required:true },  // 数组的图片,和动态是一样的
  content: { type:String, required:true}, // 评论的内容,和动态是一样的
  plazaId: { type: Schema.Types.ObjectId, ref: 'plaza', required:true }, // 最终是挂载到哪个动态主题下面的 
  userInfo: { type: Schema.Types.ObjectId, ref: 'User' },  // 评论人的信息
  respUserInfo: { type: Schema.Types.ObjectId, ref: 'User' }, // 我是评论给谁的(指的是人),这个有可能是不需要的,至少是不需要前端传的
  toComment: { type: Schema.Types.ObjectId, ref: 'Comment' }, // 我是给那条评论来评论的
  rootComment: { type: Schema.Types.ObjectId, ref: 'Comment' }, // 如果是一级评论这个没有，二级评论的值是一级评论id
}, options);

module.exports = model('Comment', commentSchema);