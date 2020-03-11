import React from 'react'
import './AppButton.css'

const AppWarningButton = ({ text, onClick }) => {
  const handleClick = () => {
    setTimeout(() => onClick(), 200)
  }

  return (
    <div className="app-button app-warning-button" onClick={handleClick}>
      <h2>{text}</h2>
    </div>
  )
}

export default AppWarningButton
