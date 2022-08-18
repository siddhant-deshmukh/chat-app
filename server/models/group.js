const mongoose = require('mongoose')
const GroupSchema = new mongoose.Schema({
    users:[{type:mongoose.Schema.Types.ObjectId}],
    admin:[{type:mongoose.Schema.Types.ObjectId}],
    lastSeen:[{type:Date}],
    chat:{type:mongoose.Schema.Types.ObjectId,ref:"Chat id"},
})

module.exports = mongoose.model("Chat", GroupSchema);