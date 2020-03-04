import React from 'react'
import './AppMessageCard.css'

const AppMessageCardOG = ({ author, content }) => {
  return (
    <div className="app-message-card">
      <p>{author}</p>
      <div>
        <p>{content}</p>
      </div>
    </div>
  )
}

export default AppMessageCardOG
