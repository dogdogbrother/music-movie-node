const path = require('path')
const Plaza = require('../models/plaza');
const Comment = require('../models/comment');
const { returnPaging } = require('../utils')

class PlazaCtl {
  async publish(ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    ctx.request.body;
    const flag = await new Plaza({ 
      ...ctx.request.body,
      type: "mood"
    }).save();
    if(flag) ctx.status = 204
  }

  async list(ctx) {
    const { pageNumber, pageSize, page_number } = returnPaging(ctx.query)
    const userId = ctx.state.user.id.toString()
    // 先拿到当前的广场的动态
    const resList = await Plaza.find({}, null, { lean:true }).limit(pageSize).skip(pageSize*pageNumber)
    // 再拿到所有动态中的id,拿这些id当条件搜索全部的评论
    const resListIds = [].concat(...resList.map(item => item._id))
    const commenList = await Comment.find({ plazaId: {$in:resListIds} })
    resList.forEach(item => {
      if(item.up.findIndex(id => id.toString() === userId) >= 0){
        // 假如你的id在赞中,那么我就给你发送一个action = 1
        item.action = 1
      } else if(item.down.findIndex(id => id.toString() === userId) >= 0){
        item.action = 2
      }
      const comment = commenList.filter(item2 => {
        return item2.plazaId.toString() === item._id.toString()
      }).length
      item.up = item.up.length
      item.down = item.down.length
      item.comment = comment
      return item
    })
    ctx.body = resList
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
    let { down, up } = await Plaza.findById(id)
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
    const resItem = await Plaza.findByIdAndUpdate(id, { down, up },{ new: true, runValidators: true })
    if(resItem) {
      ctx.body = {
        up: resItem.up.length,
        down: resItem.down.length,
        action
      }
    }
  }
}

module.exports = new PlazaCtl()