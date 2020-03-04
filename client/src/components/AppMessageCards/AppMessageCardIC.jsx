import React from 'react'
import './AppMessageCard.css'

const AppMessageCardIC = ({ author, content }) => {
  return (
    <div className="app-message-card incoming">
      <div>
        <p>{content}</p>
      </div>
      <p>{author}</p>
    </div>
  )
}

export default AppMessageCardIC
