import React from 'react'
import './AppButton.css'

const AppButton = ({ text, onClick, loading }) => {
  const handleClick = () => {
    if (loading) return
    setTimeout(() => onClick(), 200)
  }

  return (
    <div className={`app-button${loading ? ' loading' : ''}`}
    onClick={handleClick}>
      <h2>{text}</h2>
    </div>
  )
}

export default AppButton
