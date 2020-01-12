import React from 'react'
import './AppButton.css'

const AppButton = ({ text, onClick }) => {
  const handleClick = () => {
    setTimeout(() => onClick(), 200)
  }

  return (
    <div className="app-button" onClick={handleClick}>
      <h2>{text}</h2>
    </div>
  )
}

export default AppButton
