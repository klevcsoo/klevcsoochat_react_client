import React, { useState } from 'react'
import './AppMessageCard.css'
import { firebaseHandler, formatDate } from '../../Utils'

const AppImageMessageCard = ({ messageObject: message, onClick }) => {
  const incoming = message.authorId !== firebaseHandler.getUid()
  const [ showInfo, setShowInfo ] = useState(false)

  return (
    <div className={`app-message-card image${incoming ? ' incoming' : ''}`}>
      <img src={message.authorPhoto} alt="" />
      <div onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
      className={message.animation ? ' anim' : ''}>
        <img src={message.url} alt={`${message.author} képet küldött`} onClick={() => onClick()} />
      </div>
      <p style={{
        opacity: showInfo ? 1 : 0
      }}>{message.author} - {formatDate(message.timestamp, true)}</p>
    </div>
  )
}

export default AppImageMessageCard
