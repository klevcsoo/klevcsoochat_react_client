import React from 'react'
import './AppMessageCard.css'

const AppMessageCardOG = ({ author, content }) => {
  return (
    <div className="app-message-card app-message-outgoing">
      <p>{author}</p>
      <div>
        <div></div>
        <p>{content}</p>
      </div>
    </div>
  )
}

export default AppMessageCardOG
