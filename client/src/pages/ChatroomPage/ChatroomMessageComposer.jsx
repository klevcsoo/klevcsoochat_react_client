import React from 'react'
import './ChatroomPage.css'
import AppInput from '../../components/AppInput/AppInput'
import AppSendButton from '../../components/AppButton/AppSendButton'
import { validateMessage } from '../../Utils'

const ChatroomMessageComposer = ({ messageHandling, inputRef, isSending, sendMessage }) => {
  return (
    <div className="chatroom-message-composer">
      <AppInput inChat placeholder="Aa" defaultValue={messageHandling.currentMsg} onChange={(text) => {
        messageHandling.setCurrentMsg(text)
      }} reference={inputRef} onSubmit={() => sendMessage()} />
      <AppSendButton sending={isSending}
      disabled={!validateMessage(messageHandling.currentMsg)} onClick={() => sendMessage()} />
    </div>
  )
}

export default ChatroomMessageComposer
