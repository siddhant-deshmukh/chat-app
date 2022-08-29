import React,{useState,useContext} from 'react'
//import {config} from '../../config'
import {AuthContext} from '../../context/socket'

function Login(props) {
  const [userData,setUserData] =  useState({email:'@v.com',password:'password'});
  const context = useContext(AuthContext);
  const {getUserData,logInUser} = context;
//setIsLoggedIn,setAuthState,
  const onChange = (e) =>{
    setUserData({...userData, [e.target.name] : e.target.value})
  }
  const getJwt = (e,email,password) => {
    e.preventDefault();
    logInUser(email,password).then(data =>{
      console.log(data);
      getUserData();
    })
    //setJwt(data.token);
  };

  return (
    <div className='flex h-screen min-h-full w-screen flex-col justify-center'>
        <div className='flex flex-col flex-grow place-content-center'>
            <form className='rounded-xl border-slate-500 border-8 p-7 place-self-center w-3/5' onSubmit={(e)=>{getJwt(e,userData.email,userData.password)}}>
                <div className="mb-6">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your email</label>
                    <input name = 'email' value={userData.email} onChange={onChange} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required/>
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your password</label>
                    <input name='password' value={userData.password} onChange={onChange} type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                </div>
                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
            </form>
        </div>
    </div>
  )
}

export default Login