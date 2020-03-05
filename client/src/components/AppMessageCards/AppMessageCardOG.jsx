import React from 'react'
import './AppMessageCard.css'

const AppMessageCardOG = ({ author, content, animation }) => {
  return (
    <div className="app-message-card">
      <p>{author}</p>
      <div className={animation ? ' anim' : ''}>
        <p>{content}</p>
      </div>
    </div>
  )
}

export default AppMessageCardOG
