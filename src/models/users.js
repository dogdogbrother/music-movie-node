const { Schema, model, options } = require('./config')

const userSchema = new Schema({
  createdAt: { type:String, select: false },
  updatedAt: { type:String, select: false },
  user_name: { type:String, required: true },
  password: { type:String, required: true, select:false },
  avatar_url: { type: String, default: '' }, // 头像url地址
  gender: { type:String, enum:['male', 'female'], default:'male', required:false, select:false }, // 性别
  motto: { type:String, default:'', select: false, required:false }, // 座右铭,一句话介绍
  following: { // 我关注了谁
    type: [{ type: Schema.Types.ObjectId, ref:'User' }],
    select: false,
    default: []
  },
  collectMusic: { // 我喜欢的音乐/歌曲
    type: [{ type: Schema.Types.ObjectId, ref:'Music' }],
    select: false,
    default: []
  }
}, options);

module.exports = model('User', userSchema);