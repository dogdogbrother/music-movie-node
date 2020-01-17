const { Schema, model, options } = require('./config')

const plazaSchema = new Schema({
  createdAt: { type:String, select: true },
  updatedAt: { type:String, select: false },
  type: { type:String, enum:['movie', 'music', 'mood'], required:true },
  up: { type: [{ type: Schema.Types.ObjectId, ref:'User' }], default: [] },
  down: { type: [{ type: Schema.Types.ObjectId, ref:'User' }], default: [] },
  img: { type: [{ type:String }], default:[], required: true },
  content: { type:String, required:true}
}, options);

module.exports = model('Plaza', plazaSchema);