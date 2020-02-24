import React from 'react'
import './ChatroomPage.css'
import AppInput from '../../components/AppInput/AppInput'
import LoadingSpinner from '../../components/LoadingSpinner'
import AppSendButton from '../../components/AppButton/AppSendButton'

const ChatroomMessageComposer = ({ messageHandling, inputRef, isSending, sendMessage }) => {
  return (
    <div className="chatroom-message-composer">
      <AppInput inChat placeholder="Aa" defaultValue={messageHandling.currentMsg} onChange={(text) => {
        messageHandling.setCurrentMsg(text)
      }} reference={inputRef} onSubmit={() => sendMessage()} />
      {isSending ? <LoadingSpinner /> : (
        <AppSendButton disabled={messageHandling.currentMsg.length === 0} onClick={() => sendMessage()} />
      )}
    </div>
  )
}

export default ChatroomMessageComposer
