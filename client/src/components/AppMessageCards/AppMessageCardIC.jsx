import React from 'react'
import './AppMessageCard.css'

const AppMessageCardIC = ({ author, content }) => {
  return (
    <div className="app-message-card app-message-incoming">
      <p>{author}</p>
      <div>
        <p>{content}</p>
      </div>
    </div>
  )
}

export default AppMessageCardIC
