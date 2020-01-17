const { Schema, model, options } = require('./config')

const mongoose = require('mongoose');
const musicSchema = new Schema({
  createdAt: { type:String, select: false },
  updatedAt: { type:String, select: false },
  song_name: { type:String, required: true },
  song_url: { type:String, required: true },
  author: { type: String, required: true },
  cover_url: { type: String, default: ''},
  upload_user:{ type: Schema.Types.ObjectId, required: true, ref:'User', select: false }
},options);

module.exports = model('Music', musicSchema);