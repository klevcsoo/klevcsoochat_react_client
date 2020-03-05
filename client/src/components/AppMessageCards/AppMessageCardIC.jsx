import React from 'react'
import './AppMessageCard.css'

const AppMessageCardIC = ({ author, content, animation }) => {
  return (
    <div className="app-message-card incoming">
      <div className={animation ? ' anim' : ''}>
        <p>{content}</p>
      </div>
      <p>{author}</p>
    </div>
  )
}

export default AppMessageCardIC
