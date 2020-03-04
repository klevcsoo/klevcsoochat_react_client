import React, { useState } from 'react'
import './ChatroomPage.css'
import AppInput from '../../components/AppInput/AppInput'
import AppSendButton from '../../components/AppButton/AppSendButton'
import { validateMessage, firebaseHandler } from '../../Utils'

const ChatroomMessageComposer = ({ inputRef, scrollToBottom, roomId }) => {
  const [ message, setMessage ] = useState('')
  const [ sending, setSending ] = useState(false)

  const sendMessage = () => {
    if (!validateMessage(message)) return

    setSending(true)
    if (inputRef.current) inputRef.current.focus()
    firebaseHandler.sendMessage(roomId, message, () => {
      setSending(false); scrollToBottom()
    }, (err) => console.log(err))
  }

  return (
    <div className="chatroom-message-composer">
      <AppInput inChat placeholder="Aa" onChange={(text) => {
        setMessage(text)
      }} reference={inputRef} onSubmit={() => sendMessage()} />
      <AppSendButton sending={sending}
      disabled={!validateMessage(message)} onClick={() => sendMessage()} />
    </div>
  )
}

export default ChatroomMessageComposer
