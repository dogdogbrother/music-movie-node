const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  createdAt: { type:String, select: false },
  updatedAt: { type:String, select: false },
  song_name: { type:String, required: true },
  song_url: { type:String, required: true },
  author: { type: String, required: true },
  cover_url: { type: String, default: ''},
  upload_user:{ type: Schema.Types.ObjectId, required: true, ref:'User', select: false }
},{
  versionKey: false,
  timestamps: true
});

module.exports = model('Music', userSchema);