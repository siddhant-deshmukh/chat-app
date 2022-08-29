import React from 'react'

function Text(props) {
  var time2= new Date(props.time).toLocaleTimeString('en-US', { hour12: false });
  const time = time2.slice(0,-3);

  return (
    <div className={`w-full  bg-slate-400 grid px-3`}>
      <div className={`w-fit max-w-md  rounded-xl mb-3  place-self-${(props.userId === props.msgAuthor)?'end bg-green-100' : 'start bg-white'}`}>
        <div className='px-3'>
          <div className='font-semibold text-xs pb-2'>{time2 + "\t  " + props.mainM.tieBreaker.toString()}</div>
          <div className='font-semibold text-xs pb-2'>{props.author}</div>
          {props.msg}
        </div>
        <div className='relative -z-5 text-black text-xs px-2  float-right'>{time}</div>
      </div>
    </div>
  )
}

export default Text