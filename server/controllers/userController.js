const Users = require('../models/users');
const Chat = require('../models/chat')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const async = require("async")
const mongoose = require("mongoose")

exports.register_user = async (req,res,next) => {
    try {
        // Get user input
        const { name, email, password } = req.body;
        // Validate user input
        if (!(email && password && name )) {
          res.status(400).send("All input is required");
        }
    
        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await Users.findOne({ email });
    
        if (oldUser) {
          return res.status(409).send("User Already Exist. Please Login");
        }
        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);
    
        // Create user in our database
        const user = await Users.create({
          name,
          email: email.toLowerCase(), // sanitize: convert email to lowercase
          password: encryptedPassword,
        });
    
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
        // save user token
        //user.token = token;
    
        // return new user
        res.cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        return res.status(201).json({token});
      } catch (err) {
        console.log(err);
      }
    
}

exports.login_user = async (req,res,next) =>{

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await Users.findOne({ email });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        res.cookie("access_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        });
        //console.log(token)
        return res.status(201).json({token});
      }
      res.status(400).send("Invalid Credentials");
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
}

exports.send_message = async (req,res,next) =>{
  try{
    const { sendingTo,messageType,message } = req.body;
    //console.log(sendingTo,messageType,message)
    if(!(sendingTo && messageType && message)){
      res.status(400).send("All input is required");
    };
    //sendingTo=mongoose.Types.ObjectId(sendingTo)

    const reciever = await Users.findById(sendingTo);
    const user = await Users.findById(req.user._id);
    if(!(reciever && user)){
      res.status(400).send("All input is required");
    };
    //console.log(user.contact, reciever._id)
    a =   user.contact.find( (o,i) => {
      //console.log(o.uId.toString(),reciever._id.toString());
      return o.uId.toString() === reciever._id.toString();
    });

    if(!a){
        const chat = await Chat.create({
          users:[req.user._id,mongoose.Types.ObjectId(sendingTo)],
        })
        
        user.contact.push({uId:reciever._id , chatId:chat._id })
        reciever.contact.push({uId:user._id , chatId:chat._id })
        chat.messages.push({
          type:"string",
          author:user._id,
          message:message,
        }); 

        await user.save();
        await reciever.save();
        await chat.save();
    }else{
      const chat = await Chat.findById(a.chatId);
      if(!chat){
        return res.status(400).send("Internal Server Error!!!");
      }
      if(chat.users.includes(user._id)){
        chat.messages.push({
          type:"string",
          author:user._id,
          message:message,
        });
        await chat.save();
      }else{
        return res.status(400).send("Internal Server Error!!!");
      }
    }
    return res.status(201).json({a,reciever,user})
  }catch (err){
    console.log(err);
  }
}

exports.get_user_data = async (req,res,next) =>{
  try{
    const friends = {};
    
    for(const ele of req.user.contact){
      //console.log(ele.uId.toString(),friends);
      const friend = await Users.findById(ele.uId.toString()).select({'password':0});
      friends[ele.chatId.toString()] = {
        name : friend.name,
        email : friend.email,
        friendId : ele.uId.toString(),
      }
      
    }
    //console.log(friends)
    return res.status(201).json({user : req.user ,friends});
  }catch(err){
    console.log(err);
  }
}

exports.logout_user = async (req,res,next) =>{
  try{
    res.clearCookie("access_token");
    return res.status(201).json({'msg':'sucessfully logout!'});
  } catch(err){
    console.log(err);
  }
}

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

exports.add_connection = async (req,res,next) => {
  try{

    const {socketId} = req.body;
    console.log('add connection   :', req.body)
    if(!socketId){
      return res.status(400).json({msg: "All input is required"});
    }

    if(!req.user.socketId){req.user['socketId']=''};
    //if(req.user.socketId!=''){
    //  return res.status(301).json({msg: "Already connected" , socketId:req.user.socketId});
    //}

    req.user.socketId = socketId;

    const user = await req.user.save();

    return res.status(201).json({msg: "Sucessful" , user});
  }catch(err){
    console.log(err);
  }
}

exports.remove_connection = async (req,res,next) => {
  try{

    req.user.socketId = '';

    const user = await req.user.save();

    return res.status(201).json({msg: "Sucessful" , user});
  }catch(err){
    console.log(err);
  }
}