const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  __v: { type: Number, select: false },
  user_name: { type: String, required: true },
  password: { type: String, required: true, select: false },
  avatar_url: { type: String, default: '' }, // 头像url地址
  gender: { type: String, enum: ['male', 'female'], defaulet: 'male',  required: false }, // 性别
  motto: { type: String, select: false }, // 座右铭,一句话介绍
  following:{ // 关注得的人
    type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      select: false
  }
},{
  versionKey: false,
  timestamps: true
});

module.exports = model('User', userSchema);