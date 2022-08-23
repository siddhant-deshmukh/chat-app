import React from 'react'

function Text(props) {
  return (
    <li className='w-full bg-slate-400 grid'>
      <div className='w-fit max-w-md bg-green-100 rounded-xl p-3 mb-3 place-self-end'>
        <div className='font-semibold text-xs mb-1'>{props.author}</div>
        {props.msg}
        <br/>
        
      </div>
    </li>
  )
}

export default Text