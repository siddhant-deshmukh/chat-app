const Users = require('../models/users');
const Chat = require('../models/chat')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
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