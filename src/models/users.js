const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  createdAt: { type:String, select: false },
  updatedAt: { type:String, select: false },
  user_name: { type:String, required: true },
  password: { type:String, required: true, select:false },
  avatar_url: { type: String, default: '' }, // 头像url地址
  gender: { type:String, enum:['male', 'female'], default:'male', required:false, select:false }, // 性别
  motto: { type:String, default:'', select: false, required:false }, // 座右铭,一句话介绍
  following:{ // 关注得的人
    type: [{ type: Schema.Types.ObjectId, ref:'User' }],
      select: false
  }
},{
  versionKey: false,
  timestamps: true
});

module.exports = model('User', userSchema);