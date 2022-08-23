const Users = require('../models/users');
const Chat = require('../models/chat')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const async = require("async")
const mongoose = require("mongoose")

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

exports.send_message = async (req,res,next) =>{
    try{
      const {chatId,message} = req.body;
      if(!chatId ){return res.status(301).json({msg: "All input is required"});}
      
      const chat = await Chat.findById(chatId);
      if(!chat){return res.status(301).json({msg: "Chat not found"});}
      const user = req.user;
      
      const msg = {
        author:user._id,
        type:"String",
        message:message,
        };
      if(chat.users.includes(user._id)){
        chat.messages.push(msg);
        await chat.save();
      }else{
        return res.status(401).json({msg: "Permission denied"});
      }
      return res.status(201).json({msg: msg});
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

        return res.status(400).json({user,friend});
    }catch(err){
        console.log(err);
    }
}