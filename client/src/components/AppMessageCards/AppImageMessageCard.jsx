import React from 'react'
import './AppMessageCard.css'
import { firebaseHandler } from '../../Utils'

const AppImageMessageCard = ({ messageObject: message, animation, onClick }) => {
  const incoming = message.authorId !== firebaseHandler.getUid()

  return (
    <div className={`app-message-card image${incoming ? ' incoming' : ''}`}>
      <img src={message.authorPhoto} alt="" />
      <div className={message.animation ? ' anim' : ''}>
        <img src={message.url} alt={`${message.author} képet küldött`} onClick={() => onClick()} />
      </div>
      <p>{message.author}</p>
    </div>
  )
}

export default AppImageMessageCard
