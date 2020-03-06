import React from 'react'
import './AppMessageCard.css'

const AppImageMessageCard = ({ author, url, animation, incoming }) => {
  return (
    <div className={`app-message-card image${incoming ? ' incoming' : ''}`}>
      <div className={animation ? ' anim' : ''}>
        <img src={url} alt={`${author} képet küldött`} />
      </div>
      <p>{author}</p>
    </div>
  )
}

export default AppImageMessageCard
