import React from 'react'
import { SendRounded } from '@material-ui/icons'

const AppSendButton = ({ disabled, onClick }) => {
  const handleClick = () => {
    if (!disabled) setTimeout(() => onClick(), 200)
  }

  return (
    <div className={`app-send-button${disabled ? ' disabled' : ''}`} onClick={handleClick}>
      <SendRounded />
    </div>
  )
}

export default AppSendButton
