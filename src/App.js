//import {SocketContext, socket} from './context/socket';
import {AuthProvider, AuthContext} from './context/socket';
import MessageApp from './components/MessageApp';
import {config} from './config';
import Login from './components/forms/Login';
import { useState,useContext } from 'react';

const apiUrl = config.API_URL;



function App() {
  return(
    <AuthProvider>
      <div className='p-5 w-screen h-screen'>
        <MessageApp/>
      </div>
    </AuthProvider>
  );
}

export default App;

/**
 
const storedJwt = localStorage.getItem('token');
  const [jwt, setJwt] = useState(storedJwt || null);
  const [fetchError, setFetchError] = useState(null);

  const getJwt = async (e,email,password) => {
    
    e.preventDefault();
    var data  = await fetch(`${apiUrl}/users/login`,{
      method:"POST",
      headers:{
        'Content-Type':'application/json',
      },
      body : JSON.stringify({
        "email" : email,
        "password": password
      }),
    });
    data = await data.json();
    
    //"g@g.com"
    //"random"
    console.log("data" , data);
    localStorage.setItem('token', data.token);
    setJwt(data.token);
  };

  console.log('storedJwt',storedJwt);
  if(storedJwt && storedJwt!=="undefined"){
    return(
      <div>{storedJwt}</div>
    )
  }else{
    return(
      <Login getJwt={getJwt}/>
    )
  }

  //return (
  //  <SocketContext.Provider value={socket}>
  //    <MessageApp/>
  //  </SocketContext.Provider> 
  //);
 */