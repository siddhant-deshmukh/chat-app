import React from 'react'

function FriendCard(props) {
  const changeSelected = (e) =>{
    props.setSelected(props.chatId)
  }
  return (
    <li className="py-3 sm:py-4 hover:bg-slate-200">
        <button type="button" onClick={(e)=>{changeSelected()}} className="flex items-center space-x-4">
            
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                    {props.value.name}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                    {props.value.email}
                </p>
            </div>
            
        </button>
        
    </li>
  )
}

export default FriendCard;

/**
 <div className="flex-shrink-0">
                <img className="w-8 h-8 rounded-full" src="/docs/images/people/profile-picture-1.jpg" alt="Neil image"/>
            </div>

 */