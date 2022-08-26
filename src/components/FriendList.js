import React,{useContext} from 'react'
import FriendCard from './message-components/FriendCard';
import {AuthContext} from '../context/socket'

function FriendList(props) {
  const context = useContext(AuthContext);
  const {authState} = context;

  return (
    
    <div className="p-4 w-2/6  bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Latest Customers</h5>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {Object.keys(authState.friends).map((ele)=>{
            //console.log(ele,authState.friends[ele]);
            return <FriendCard key={ele} chatId={ele} value= {authState.friends[ele]} setSelected={props.value.setSelected}/>
          })}
        </ul>
      </div>
    </div>

  )
}

export default FriendList