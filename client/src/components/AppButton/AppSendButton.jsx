import React from 'react'
import { SendRounded } from '@material-ui/icons'

const AppSendButton = ({ sending, disabled, onClick }) => {
  const handleClick = () => {
    if (!disabled) setTimeout(() => onClick(), 200)
  }

  return (
    <div className={`app-send-button${disabled ? ' disabled' : ''}${sending ? ' sending' : ''}`}
    onClick={handleClick}>
      <SendRounded color="inherit" />
    </div>
  )
}

export default AppSendButton
