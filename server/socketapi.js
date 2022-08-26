var io = require('./app').io
var cookie = require('cookie')
const jwt = require("jsonwebtoken");
const Users = require('./models/users')
const config = process.env;

const socketapi = ()=>{
    console.log("MEOW")
}

const takeUserId = async (socket) =>{
    if(!socket.handshake.headers.cookie){
        return null;
    }
    const {access_token} = cookie.parse(socket.handshake.headers.cookie)
    if(!access_token){
        console.log(cookie.parse(socket.handshake.headers.cookie))
        return null;
    }
    const decoded = jwt.verify(access_token, config.TOKEN_KEY);
    console.log(decoded)
    const user = await Users.findById(decoded.user_id).select({'password':0})
    if(!user) {
      return null;
    }
    if(user.socketId){
        user.socketId = '';
    }
    if(user.socketId === ''){
        user.socketId = socket.id;
    }else{
    }

    await user.save();
    return user._id.toString();
}
const disconnect = async (_id) => {
    const user = await Users.findById(_id).select({'password':0});
    user.socketId = ''
    await user.save();
}
io.on( "connection", async (socket) => {
    var _id= await takeUserId(socket);
    console.log( "A user connected" , socket.id, _id);
    
    
    socket.on('disconnect',async (reason)=>{
        console.log(reason, 'disconnecting!!!')
        await disconnect(_id)
    })
});
// end of socket.io logic

module.exports = socketapi;