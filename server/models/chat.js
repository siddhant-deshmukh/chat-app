const mongoose = require('mongoose')

const subSchema = new mongoose.Schema({
    author:mongoose.Schema.Types.ObjectId,
    type:{type:String,default:"string"},
    message:{type:String}
},{_id:false})
const ChatSchema = new mongoose.Schema({
    users:[{type:mongoose.Schema.Types.ObjectId}],
    lastSeen:[{type:Date}],
    messages:[ subSchema ],
})

module.exports = mongoose.model("Chat", ChatSchema);