 const {model, Schema, Types} = require('mongoose')

 const schema = new Schema({
   owner: { type: Types.ObjectId, ref:'User' },
   title: { type: String },
   description: { type: String },
   color: { type: String }
 })

 module.exports = model('Todo', schema )