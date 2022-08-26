const mongoose = require('mongoose')

const subSchema = new mongoose.Schema({
    uId : mongoose.Schema.Types.ObjectId , 
    chatId : mongoose.Schema.Types.ObjectId
},{_id:false})
const UserSchema = new mongoose.Schema({
    name : {type:String,required:true},
    socketId : {type:String},
    email: {type:String,required:true,unique:true},
    password: {type:String,required:true},
    groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'product'}],
    contact : [subSchema],
})

module.exports = mongoose.model("Users", UserSchema);