import socketio from "socket.io-client";
import {config} from "../config";

const socket = socketio.io(config.API_URL,{autoConnect : false,withCredentials: true})

socket.onAny((event, ...args) => {
    console.log(event, args);
});
//socket.on('new message', (data)=>{
//    console.log(data.newMsg)
//    console.log('!!!!!!!!!!!!!!!!!!!!!1 \n someone has send this message \n !!!!!!!!!!!!!!!!!!!!!!! \n',data)
//    //const newMessages = messages.slice();
//    //newMessages.push(newMsg);
//    //setMessages(newMessages);
//})
socket.offAny((event, ...args)=>{
    console.log('off : off :',event, args);
})

export default socket;