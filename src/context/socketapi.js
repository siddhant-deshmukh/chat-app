import socketio from "socket.io-client";
import {config} from "../config";

const socket = socketio.io(config.API_URL,{autoConnect : false,withCredentials: true})

socket.onAny((event, ...args) => {
    console.log(event, args);
});
socket.offAny((event, ...args)=>{
    console.log('off : off :',event, args);
})

export default socket;