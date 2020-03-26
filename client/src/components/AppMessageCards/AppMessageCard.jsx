import React, { useState } from 'react'
import './AppMessageCard.css'
import { firebaseHandler, formatDate } from '../../Utils'

const AppMessageCard = ({ messageObject: message }) => {
  const incoming = message.authorId !== firebaseHandler.getUid()
  const [ showInfo, setShowInfo ] = useState(false)

  return (
    <div className={`app-message-card${incoming ? ' incoming' : ''}`}>
      <img src={message.authorPhoto} alt="" />
      <div onMouseEnter={() => setShowInfo(true)}
      onMouseLeave={() => setShowInfo(false)}
      className={message.animation ? ' anim' : ''}>
        <p>{message.content}</p>
      </div>
      <p style={{
        opacity: showInfo ? 1 : 0
      }}>{message.author} - {formatDate(message.timestamp, true)}</p>
    </div>
  )
}

export default AppMessageCard
