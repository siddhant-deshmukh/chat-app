import React,{useContext,useState,useRef} from 'react'
import { useEffect } from 'react';
import {AuthContext} from '../../context/socket'
import { config } from '../../config';

import Text from './Text';

function Chat(props) {
  const context = useContext(AuthContext);
  const {authState,getMessages,socket} = context;

  const [messages,setMessages] = useState([]);
  const [members,setMembers] = useState({});
  const [msg,setMsg] = useState('');
  
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView();
  };
  //useEffect(()=> {scrollToBottom()}, [messages]);

  
  useEffect(()=>{
    //console.log("This means at some point of time we really came here",socket.id,socket)
    const handleEventNewMessage = (data)=>{
        //console.log(data.newMsg)
        //console.log('!!!!!!!!!!!!!!!!!!!!!1 \n someone has send this message \n !!!!!!!!!!!!!!!!!!!!!!! \n',data)
        const newMessages = messages.slice();
        if(data.newMsg.author !== authState.user._id.toString()) newMessages.push(data.newMsg);
        setMessages(newMessages);
    
      }

    socket.on('new message', handleEventNewMessage)

    return ()=>{
        socket.off('new message', handleEventNewMessage)
    }
  },[socket])
  
  useEffect(()=>{
    if(props.selected !== ''){
        getMessages(props.selected).then(data =>{
            setMessages(data.messages);
            setMembers(data.groupMembers);
            scrollToBottom();
        });
    }
  },[props.selected])
  
  const onChange = (e) => {
    setMsg(e.target.value)
  }

  const send_message = async () => {
    if(props.selected === '') return;
    const suc = await fetch(`${config.API_URL}/users/personal/sendmessage`, {
        method:"POST",
        headers:{
            'Content-Type':'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            chatId : props.selected,
            message:msg,
        }),
    })
    const ret = await suc.json();
    //console.log('ret',ret);
    return ret;
  }

  const onClick = (e) =>{
    e.preventDefault();
    send_message().then(ret =>{
        if(ret.msg){
            const newMessages = messages.slice();
            newMessages.push(ret.msg);
            setMessages(newMessages);
        };
    });
    setMsg('');
  }

  return (
    <div className='relative w-full' >
        <div className='overflow-auto w-full h-full pb-12'>
            <ul>
                {messages.map((ele,index)=>{
                    return <Text key={index} msg={ele.message} author={members[ele.author].name}/>
                })}
                <div ref={messagesEndRef}></div>
            </ul>
        </div>
        <div className='absolute inset-x-0 bottom-0'>
            <form>
                <label htmlFor="chat" className="sr-only">Your message</label>
                <div className="flex items-center py-2 px-3 bg-gray-50 rounded-lg dark:bg-gray-700">
                    <button type="button" className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                        <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Upload image</span>
                    </button>
                    <button type="button" className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
                        <svg aria-hidden="true" className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd"></path></svg>
                        <span className="sr-only">Add emoji</span>
                    </button>
                    <textarea value={msg} onChange={onChange} id="chat" rows="1" className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea>
                        <button onClick ={(e) => {onClick(e)}} type="submit" className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
                        <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                        <span className="sr-only">Send message</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Chat