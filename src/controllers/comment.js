const path = require('path')
const Plaza = require('../models/plaza');
const Comment = require('../models/comment');
const { returnPaging } = require('../utils')
class CommentCtl {
  async addComment(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      plazaId: { type: 'string', required: true }
    })
    const { plazaId } = ctx.params; // 和model层是对应的,带时候可以直接放进去
    const { toComment } = ctx.request.body
    if (toComment) {
      const comment = await Comment.findById(toComment).select("+userInfo").populate("userInfo")
      if(!comment) ctx.throw(409, '评论目标不存在')
      ctx.request.body.respUserInfo = comment.userInfo
    }
    const comment = await new Comment({ 
      ...ctx.request.body,
      plazaId,
      userInfo: ctx.state.user.id
    }).save();
    if(comment) ctx.body = comment
  }

  async comment(ctx) {
    const { pageNumber, pageSize, page_number } = returnPaging(ctx.query, 4, 1)
    const { plazaId } = ctx.params;
    const userId = ctx.state.user.id.toString()
    // 先找到一级评论,规则就是没有 rootComment 属性的就是一级.
    // 二级有rootComment却没有toComment的就是直接评论1级的.
    // 二级中有rootComment和toComment的就是在二级中相互评论的.
    const rootComment = await Comment.find({ $and: [ { plazaId }, { rootComment: { "$exists": false } }] }, 
      null, 
      { lean: true }
    )
    .limit(pageSize)
    .skip(pageSize*pageNumber)
    .select("+userInfo")
    .populate("userInfo")
    // 查找到总数,用于做分页
    const rootCommentSum = await Comment.find({ $and: [ { plazaId }, { rootComment: { "$exists": false } } ] }).countDocuments()
    await new Promise(
      function (resolve, reject) {
        if(!rootComment.length) resolve() 
        rootComment.forEach(async (item, index) => {
          // 这里循环1级评论,根据 rootComment 找到自己的子级评论
          // 只拿前四个,如果超过四个就做分页
          const subCommentSum = await Comment.find({ rootComment: item._id }).countDocuments()
          const subComment = await Comment.find({ rootComment: item._id }, null, { lean:true })
          .limit(4)
          .skip(0)
          .select("+respUserInfo +toComment +rootComment")
          .populate("userInfo").populate("respUserInfo")
          
          subComment.forEach(item2 => {
            if(!item2.toComment) {
              // 如果你的评论目标不存在toComment就是说不是2对2评论,就没有必要返回 respUserInfo
              delete item2.respUserInfo
            }
            if(item2.up.findIndex(id => id.toString() === userId) >= 0){
              // 假如你的id在赞中,那么我就给你发送一个action = 1
              item2.action = 1
            } else if(item2.down.findIndex(id => id.toString() === userId) >= 0){
              item2.action = 2
            }
            item2.up = item2.up.length
            item2.down = item2.down.length
          })
          if(item.up.findIndex(id => id.toString() === userId) >= 0){
            // 假如你的id在赞中,那么我就给你发送一个action = 1
            item.action = 1
          } else if(item.down.findIndex(id => id.toString() === userId) >= 0){
            item.action = 2
          }
          item.subComment = {
            lish: subComment,
            total: subCommentSum,  
            page_size: 4,
            page_number: 1,
            prePage: null,
            nextPage: subCommentSum < 5 ? null : `/comment/${ plazaId }/${item._id}/sub_comment?page_size=4&page_number=2`
          },
          item.up = item.up.length
          item.down = item.down.length
          if(index+1 === rootComment.length) resolve() 
        })
      }
    )
    const prePage = page_number < 2 ? null : `comment/${ plazaId }?page_size=${ pageSize }&page_number=${ page_number - 1 }`
    const nextPage = pageSize * page_number < rootCommentSum 
    ? `comment/${ plazaId }?page_size=${ pageSize }&page_number=${ page_number + 1 }`
    : null
    ctx.body = {
      list: rootComment,
      total: rootCommentSum,
      page_size: pageSize,
      page_number: page_number,
      prePage,
      nextPage
    }
  }

  async subComment(ctx) {
    ctx.body = '测试'
  }

  async upDowen(ctx) {
    ctx.verifyParams({
      action: { type: 'number', enum:[0, 1, 2], required: true },
      id: { type: 'string', required: true },
    })
    const { id } = ctx.params
    let { action } = ctx.request.body
    if(action !== 1 && action !== 2) action = 0
    const { id: userid } = ctx.state.user
    const useridString = userid.toString()
    let { down, up } = await Comment.findById(id)
    const contrast = (id) => {
      return id.toString() !== useridString
    }
    if(action == 1) {
      // 如果是1的话就是要给用户点赞了,那么就要
      down = down.filter(id => contrast(id, false))
      if(up.includes(userid)) {
        return ctx.throw(409, "不能重复赞")
      }
      up.push(userid)
    } else if (action == 2) {
      up = up.filter(id => contrast(id, false))
      if(down.includes(userid)) {
        return ctx.throw(409, "不能重复踩")
      }
      down.push(userid)
    } else {
      down = down.filter(id => contrast(id, false))
      up = up.filter(id => contrast(id, false))
      down = []
      up = []
    }
    const resItem = await Comment.findByIdAndUpdate(id, { down, up },{ new: true, runValidators: true })
    if(resItem) {
      ctx.body = {
        up: resItem.up.length,
        down: resItem.down.length,
        action
      }
    }
  }
}

module.exports = new CommentCtl()