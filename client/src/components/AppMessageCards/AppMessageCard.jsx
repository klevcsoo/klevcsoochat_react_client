import React from 'react'
import './AppMessageCard.css'
import { firebaseHandler } from '../../Utils'

const AppMessageCard = ({ messageObject: message }) => {
  const incoming = message.authorId !== firebaseHandler.getUid()

  return (
    <div className={`app-message-card${incoming ? ' incoming' : ''}`}>
      <img src={message.authorPhoto} alt="" />
      <div className={message.animation ? ' anim' : ''}>
        <p>{message.content}</p>
      </div>
      <p>{message.author}</p>
    </div>
  )
}

export default AppMessageCard
