import React from 'react'
import './AppMessageCard.css'

const AppMessageCard = ({ author, content, animation, incoming }) => {
  return (
    <div className={`app-message-card${incoming ? ' incoming' : ''}`}>
      <div className={animation ? ' anim' : ''}>
        <p>{content}</p>
      </div>
      <p>{author}</p>
    </div>
  )
}

export default AppMessageCard
