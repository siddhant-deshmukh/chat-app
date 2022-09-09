<<<<<<< HEAD
=======
import { YourMessage } from './YourMessage';
>>>>>>> 709e225 (.)
import React,{useContext,useState,useRef,useCallback} from 'react'
import { useEffect } from 'react';
import {AuthContext} from '../../context/socket'
import { config } from '../../config';

import Text from './Text';

function Chat({messages,setMessages,selected}) {
  const context = useContext(AuthContext);
<<<<<<< HEAD
  const {authState,getMessages,socket} = context;
=======
  const {authState,socket} = context;
>>>>>>> 709e225 (.)

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
<<<<<<< HEAD
  const [messages,setMessages] = useState([]);
=======
  
>>>>>>> 709e225 (.)
  
  const [members,setMembers] = useState({});
  
  const messagesEndRef = useRef(null);
  const loader = useRef(null);
  const messageList = useRef(null);

<<<<<<< HEAD
=======
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

>>>>>>> 709e225 (.)
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView();
  };   
  const scrollStay = () => {
    //loader.current.scrollIntoView();
  };    
  //useEffect(()=> {scrollToBottom()}, [messages]);

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
    
    console.log(res.messages[0].messages)
    
    setMessages((prev) => res.messages[0].messages.concat(prev));
    setLoading(false);
    } catch (err) {
      setError(err);
    }
  }, [page]);
<<<<<<< HEAD
=======

>>>>>>> 709e225 (.)
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
      console.log('!!!!!!!!!!!!!!!!!!!! :::::::::::::::::::::', page)
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
  
  useEffect(()=>{
<<<<<<< HEAD
    if(props.selected !== ''){
        getMessages(props.selected).then(data =>{
=======
    if(selected !== ''){
        getMessages(selected).then(data =>{
>>>>>>> 709e225 (.)
            //console.log()
            console.log("data messages :",data.groupMembers)
            //setMessages(data.messages);
            setMembers(data.groupMembers);

<<<<<<< HEAD
            console.log('Something is happeing',props.selected)
=======
            console.log('Something is happeing',selected)
>>>>>>> 709e225 (.)
            setPage(1);
            scrollToBottom();
        });
        
    }
<<<<<<< HEAD
  },[props.selected])

  
  useEffect( ()=>{
    let cId = props.selected
=======
  },[selected])
  useEffect( ()=>{
    let cId = selected
>>>>>>> 709e225 (.)
    //scrollStay()
    //disableScroll();
    console.log('!!\t!!', messageList.current.style.overflow)
    messageList.current.style.overflow = 'hidden';
    console.log('\n', page,' \n')
    getMessagesInRange(cId,10,10).then(()=>{
      messageList.current.style.overflow = 'scroll';
<<<<<<< HEAD
    });

    //enableScroll();
  },[page])

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
    console.log('ret',ret);
    return ret.msg;
  }

  const onClick = (e) =>{
    e.preventDefault();
    send_message().then(ret =>{
        if(ret[0]){
            let newMessages = messages.slice();
            newMessages.push(ret[0]);
            setMessages(newMessages);
        };
=======
>>>>>>> 709e225 (.)
    });

    //enableScroll();
  },[page])




 

  return (
<<<<<<< HEAD
    <div className='relative w-full' >
=======
    
>>>>>>> 709e225 (.)
        <div ref={messageList} style={{'overflowAnchor': 'none',position: "sticky"}} id='message-list' className='overflow-auto  w-full h-full pb-12'>
            <div >
                <div ref={loader} />
                {messages.slice().map((ele,index)=>{
                    return <Text mainM={ele} key={ele.time.toString() + ele.tieBreaker.toString()} msgAuthor={ele.author.toString()} time={ele.time} msg={ele.message} author={members[ele.author].name} userId={authState.user._id.toString()}/>
                })}
                <div ref={messagesEndRef}></div>
            </div>
        </div>
  )
}

export default Chat;