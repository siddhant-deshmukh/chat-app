import React,{useContext,useState,useRef,useCallback} from 'react'
import { useEffect } from 'react';
import {AuthContext} from '../../context/socket'
import { config } from '../../config';

import Text from './Text';
import { YourMessage } from './YourMessage';

function Chat(props) {
  const context = useContext(AuthContext);
  const {authState,getMessages,socket} = context;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [messages,setMessages] = useState([]);
  
  const [divHeight,setDivHeight] = useState(0)
  const [members,setMembers] = useState({});
  const [msg,setMsg] = useState('');
  
  const messagesEndRef = useRef(null);
  const loader = useRef(null);
  const messageList = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView();
  };   
  const scrollStay = () => {
    //loader.current.scrollIntoView();
  };    
  
  //on changing length of messages it's job is to maintain heigh of the page (controll scroll)
  useEffect(()=> {
    if(messages.length != 0){
      if(page<=1){
        scrollToBottom()
        setDivHeight(messagesEndRef.current.getBoundingClientRect().bottom)
      }else{
        setDivHeight((prev) => {
          let r = messagesEndRef.current.getBoundingClientRect().bottom
          if(page >1) messageList.current.scroll(0,messagesEndRef.current.getBoundingClientRect().bottom-prev-20);
          console.log(page,prev,messagesEndRef.current.getBoundingClientRect().bottom,prev-messagesEndRef.current.getBoundingClientRect().bottom)
          return r
        })
      } 
    }
  },[messages]);

  //when anther user send some message to this user this will add a message in this user
  useEffect(()=>{
    //console.log("This means at some point of time we really came here",socket.id,socket)
    console.log('before message',messages)
    socket.on('new message', (data)=>{
        const currMessages = [];
        //console.log('first message',currMessages)
        
        data.newMsg.forEach((m)=>{
            currMessages.push(m);
        })
        console.log('newMessage',currMessages);
        setMessages((prev)=>{
            return currMessages.concat(prev)
        });
      })

    return ()=>{
        socket.off('new message', ()=>{
            console.log("OFF");
        })
    }
  },[socket])
  
  //when user gets changes this updates the messages add members of chat
  useEffect(()=>{
    if(props.selected !== ''){
      getMessages(props.selected).then(data =>{
          setMembers(data.groupMembers);
          setMessages([])
          setPage(1);
        });
    }
  },[props.selected])

  
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
      //console.log('!!!!!!!!!!!!!!!!!!!! :::::::::::::::::::::', page)
    }
  }, []);
  useEffect(() => {
    const option = {
      root: document.querySelector('#message-list'),
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);
  }, [handleObserver]);

  const getMessagesInRange = useCallback(async (cId,capacity,n) => {
    try {
      setLoading(true);
      setError(false);
      
      const data  = await fetch(`${config.API_URL}/users/personal/getmessageinrange`,{
            method:"POST",
            headers:{
              'Content-Type':'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                chatId : cId,
                position:-1*page*capacity,
                n:n
            }),
        });
        const res = await data.json();
    
    console.log(res.messages)
    
    if(res.messages.length != 0) setMessages((prev) => res.messages[0].messages.concat(prev));
    setLoading(false);
    } catch (err) {
      setError(err);
    }
  }, [page]);
  useEffect( ()=>{
    let cId = props.selected
    if(cId != ""){
      getMessagesInRange(cId,10,10)
    }
    //enableScroll();
  },[page,getMessagesInRange])

  return (
    <div className='relative w-full' >
        <div ref={messageList} style={{'overflowAnchor': 'none',position: "sticky"}} id='message-list' className='overflow-auto  w-full h-full pb-12'>
            <div ref={loader} />
            {messages.slice().map((ele,index)=>{
                return <Text mainM={ele} key={ele.time.toString() + ele.tieBreaker.toString()} msgAuthor={ele.author.toString()} time={ele.time} msg={ele.message} author={members[ele.author].name} userId={authState.user._id.toString()}/>
            })}
            <div ref={messagesEndRef}></div>
        </div>

        <YourMessage selected={props.selected} msg={msg} setMsg={setMsg} setMessages={setMessages} messages={messages} />
    </div>
  )
}

export default Chat;