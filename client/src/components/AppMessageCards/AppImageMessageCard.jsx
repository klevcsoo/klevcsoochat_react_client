import React from 'react'
import './AppMessageCard.css'

const AppImageMessageCard = ({ author, url, animation, incoming, onClick }) => {
  return (
    <div className={`app-message-card image${incoming ? ' incoming' : ''}`}>
      <div className={animation ? ' anim' : ''}>
        <img src={url} alt={`${author} képet küldött`} onClick={() => onClick()} />
      </div>
      <p>{author}</p>
    </div>
  )
}

export default AppImageMessageCard
