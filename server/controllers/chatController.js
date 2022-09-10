const Users = require('../models/users');
const Chat = require('../models/chat')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const async = require("async")
const mongoose = require("mongoose")
const io = require("../app").io

exports.get_messages = async (req,res,next) =>{
    try{
      const {chatId} = req.body;
      
      if(!chatId){
        res.status(400).json({msg: "All input is required"});
      }
  
      const chat = await Chat.findById(chatId);
      const userId = req.user._id;
  
      const groupMembers = {};
      
      await async.map(chat.users,async (data)=>{
        let userData = await Users.findById(data).select({'name':1,'email':1});
        groupMembers[data.toString()] = userData;
      })
  
      if(chat.users.includes(userId)){
        res.status(201).json({messages : chat.messages,groupMembers});
      }else{
        res.status(400).json({msg: "Permission denied!"});
      }
      
    }catch (err){
      console.log(err);
    }
}

exports.get_meesages_1 = async (req,res,next) =>{
  try{
    var {chatId,position,n} = req.body;
    
    if(!chatId && !position && !n){
      res.status(400).json({msg: "All input is required"});
    }

    const chat = await Chat.findById(chatId).select({'users':1,'messages':1})
    const newN = chat.messages.length+position+n;

    console.log(position,n)
    if(newN<0){return res.status(201).json({messages:[],position:-1*chat.messages.length,n:0});}
    const messages = await Chat.aggregate([
      {$match : {_id : mongoose.Types.ObjectId(chatId) , users:req.user._id }},
      {$project :{
        messages : {$slice : [ '$messages', position,n]}
      }}
    ]);

    if(messages){ //chat.users.includes(req.user._id)
      
      return res.status(201).json({messages,position,n});
    }else{
      return res.status(400).json({msg: "Permission denied!"});
    }
    
  }catch (err){
    console.log(err);
  }
}
exports.send_message = async (req,res,next) =>{
    try{
      const {chatId,message} = req.body;
      if(!chatId ){return res.status(301).json({msg: "All input is required"});}
      
      const chat = await Chat.findById(chatId);
      if(!chat){return res.status(301).json({msg: "Chat not found"});}
      const user = req.user;
      
      const nowD = Date.now();
      const msg = {
        author:user._id,
        type:"String",
        message:message,
        time:nowD,
      };
      const onlineFriendsSocketId = {};
      if(chat.users.includes(user._id)){
        if(chat.messages.length == 0 || chat.messages.at(-1).time !== nowD){
          msg.tieBreaker=0;
        }else{
          msg.tieBreaker = chat.messages.at(-1).tieBreaker+1;
        }
        chat.messages.push(msg);
        await chat.save();
        
        await async.map(chat.users,async (data)=>{
          if(data.toString() === req.user._id.toString()) return;
          let userData = await Users.findById(data).select({'password':0});
          console.log(data , req.user._id ,'async chat.users :: ',userData.name,userData.socketId ,'\n')
          if(userData.socketId){
            if(userData.socketId !== ''){
              //onlineFriendsSocketId[userData._id.toString()] = userData.socketId;
              const sockets = await io.in(userData.socketId).fetchSockets();
              console.log(sockets.length);

              if(sockets.length != 0) sockets[0].emit('new message',{newMsg: [msg]});
              else{
                userData.socketId = '';
                await userData.save();
              }
            }
          }
          //groupMembers[data.toString()] = userData;
        })

      }else{
        return res.status(401).json({msg: "Permission denied"});
      }
      return res.status(201).json({msg: [msg]});
    }catch (err){
      console.log(err);
    }
}

exports.add_contact = async (req,res,next) => {
    try{
        const { newFriend } = req.body;
        if(! newFriend){return res.status(301).json({msg: "All input is required"});}

        const user = req.user;
        let obj = user.contact.find(o => o.uId.toString() === newFriend)
        if(obj){
            return res.status(301).json({msg: "User Already exist!"});
        }
        const friend = await Users.findById(newFriend).select({'password':0});
        if(!friend){
            return res.status(401).json({msg: "User Doesn't exist!"});
        }

        const chat = await Chat.create({
            users:[user._id,friend._id],
        })
        //console.log(friend)
        
        user.contact.push({uId:friend._id , chatId:chat._id })
        friend.contact.push({uId:user._id , chatId:chat._id })

        await user.save();
        await friend.save();

        return res.status(200).json({user,friend});
    }catch(err){
        console.log(err);
    }
}

exports.add_messages = async (req,res,next) =>{
  try{
    const {chatId,messages} = req.body;
    if(!chatId || !messages || messages.length ==0){return res.status(301).json({msg: "All input is required"});}
    
    const chat = await Chat.findById(chatId);
    if(!chat){return res.status(301).json({msg: "Chat not found"});}
    const user = req.user;
    
    const nowD = Date.now();
    var tieBreaker =0;
    //const msg = {
    //  author:user._id,
    //  type:"String",
    //  message:message,
    //  time:nowD,
    //};

    const onlineFriendsSocketId = {};
    if(chat.users.includes(user._id)){
      if(chat.messages.length == 0 || chat.messages.at(-1).time !== nowD){
        tieBreaker=0;
      }else{
        tieBreaker = chat.messages.at(-1).tieBreaker+1;
      }
      const messages2 = []
      messages.forEach((msg,index)=>{
        msg.author = user._id;
        msg.time = nowD;
        msg.tieBreaker=tieBreaker+index;
        chat.messages.push(msg);
        messages2.push(msg)
      })
      await chat.save();
      
      await async.map(chat.users,async (data)=>{
        
        if(data === req.user._id) return;
        let userData = await Users.findById(data).select({'password':0});
        console.log(data , req.user._id ,'async chat.users :: ',userData.name,userData.socketId ,'\n')
        if(userData.socketId){
          if(userData.socketId !== ''){
            //onlineFriendsSocketId[userData._id.toString()] = userData.socketId;
            const sockets = await io.in(userData.socketId).fetchSockets();
            //console.log(messages);

            if(sockets.length != 0) sockets[0].emit('new message',{newMsg: messages2});
            else{
              userData.socketId = '';
              await userData.save();
            }
          }
        }
        //groupMembers[data.toString()] = userData;
      })

    }else{
      return res.status(401).json({msg: "Permission denied"});
    }
    return res.status(201).json({msg: messages});
  }catch (err){
    console.log(err);
  }
}