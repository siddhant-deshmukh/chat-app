import React,{useState,createContext} from "react";
import {config} from "../config";
import socket from "./socketapi";
//export const socket = socketio.connect(config.API_URL, { autoConnect: false });
//export const SocketContext = React.createContext();

export const AuthContext = createContext();

export const AuthProvider = (props)=> {
    const [authState,setAuthState] = useState({});
    const [isLogedIn,setIsLoggedIn] = useState(false);
    
    const getUserData  = async () => {
        let  data = await fetch(`${config.API_URL}/users/`,{
            method:"POST",
            credentials: 'include',
        });
        data = await data.json();
        //console.log(data);
        if(data.user !== undefined){
            if(data.socketId){
                if(data.socketId !== ''){
                    //return ;
                    //This means that their is already a socket connection and we can not make this connection
                }
            }
            setAuthState({
                user:data.user,
                friends:data.friends,
            });
            setIsLoggedIn(true)
            
            socket.auth = { userId : data.user._id };
            
            socket.connect();
            //console.log("Connedted !!!!!!!!!!!!!!!!!!!!!!!!",socket.id)

            socket.on('connect', async ()=>{
                console.log('socket id',socket.id);
                //data = await fetch(`${config.API_URL}/users/connect`,{
                //    method:"POST",
                //    credentials: 'include',
                //    headers:{
                //        'Content-Type':'application/json',
                //    },
                //    body: JSON.stringify({
                //        'socketId' : socket.id
                //    }),
                //});
            });
            socket.on('connect_error', ()=>{
                setTimeout(()=>socket.connect(),5000)
            })
            socket.on('disconnect',async ()=>{
                console.log("Disconnected !!!!!!!!!!!!!");
                data = await fetch(`${config.API_URL}/users/disconnect`,{
                    method:"POST",
                    credentials: 'include',
                });
            });
            
            
            
            //console.log(socket)
        }
        //console.log( data.user, 'data :' , data);
    }
    const logInUser = async(email,password) => {
        let data = await fetch(`${config.API_URL}/users/login`,{
            method:"POST",
            credentials: 'include',
            headers:{
              'Content-Type':'application/json',
            },
            body : JSON.stringify({
              "email" : email,
              "password": password
            }),
        })
        data = await data.json();
        console.log("data : logint token",data)
        if(data.token !== undefined){
            setIsLoggedIn(true)
        }else{
            setIsLoggedIn(false)
        }
    }
    const getMessages = async(chatId) => {
        let  data = await fetch(`${config.API_URL}/users/personal/getmessage`,{
            method:"POST",
            headers:{
              'Content-Type':'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                chatId : chatId
            }),
        });
        data = await data.json();
        //console.log("ChatId" , chatId , data);
        return data;
    }
    
    return(
    <AuthContext.Provider value={{socket,authState,setAuthState,isLogedIn,setIsLoggedIn,getUserData,logInUser,getMessages}}>
        {props.children}
    </AuthContext.Provider>
    );
    
}