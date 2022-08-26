import React,{useContext,useEffect} from 'react'
import { AuthContext } from '../context/socket'
//import FriendList from './FriendList'
import MessageUi from './MessageUi'
import Login from './forms/Login'

function MessageApp() {
  const context = useContext(AuthContext);
  const {isLogedIn,getUserData} = context;
  //console.log(isLogedIn,authState);

  useEffect(()=>{
    getUserData();
  },[]);

  if(isLogedIn){
    return (
      <MessageUi/>
    )
  }else{
    return (
      <Login />
    )
  }
  
}

export default MessageApp