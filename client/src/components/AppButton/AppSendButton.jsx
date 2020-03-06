import React from 'react'
import { SendRounded } from '@material-ui/icons'

const AppSendButton = ({ sending, enabled, onClick }) => {
  const handleClick = () => enabled ? setTimeout(() => onClick(), 200) : null

  return (
    <div className={`app-send-button app-toggle-button${enabled ? ' enabled' : ''}${sending ? ' sending' : ''}`}
    onClick={handleClick}>
      <SendRounded color="inherit" />
    </div>
  )
}

export default AppSendButton
