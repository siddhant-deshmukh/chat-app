import React,{useState,createContext} from "react";
//import socketio from "socket.io-client";
import {config} from "../config";

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
        if(data.user !== undefined){
            setAuthState({
                user:data.user,
                friends:data.friends,
            });
            setIsLoggedIn(true)
        }
        console.log( data.user, 'data :' , data);
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
    <AuthContext.Provider value={{authState,setAuthState,isLogedIn,setIsLoggedIn,getUserData,logInUser,getMessages}}>
        {props.children}
    </AuthContext.Provider>
    );
    
}