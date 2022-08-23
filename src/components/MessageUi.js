import React,{useState} from 'react'
import FriendList from './FriendList'
import Chat from './message-components/Chat'

function MessageUi() {
  const [selected,setSelected] = useState('');
  return (
    <div className='flex h-full'>
      <FriendList value={{selected,setSelected}}/>
      <Chat selected={selected}/>
    </div>
  )
}

export default MessageUi