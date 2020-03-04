import React from 'react'
import './ChatroomPage.css'
import AppInput from '../../components/AppInput/AppInput'
import AppSendButton from '../../components/AppButton/AppSendButton'
import { validateMessage } from '../../Utils'

const ChatroomMessageComposer = ({ inputRef, isSending, sendMessage }) => {
  let msg = inputRef.current?.value

  return (
    <div className="chatroom-message-composer">
      <AppInput inChat placeholder="Aa" defaultValue={msg}
      reference={inputRef} onSubmit={() => sendMessage()} />
      <AppSendButton sending={isSending}
      disabled={!validateMessage(msg)} onClick={() => sendMessage()} />
    </div>
  )
}

export default ChatroomMessageComposer
