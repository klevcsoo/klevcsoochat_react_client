import React, { useState, useEffect } from 'react'
import './ChatroomPage.css'
import AppInput from '../../components/AppInput/AppInput'
import AppSendButton from '../../components/AppButton/AppSendButton'
import { validateMessage, firebaseHandler, validateImageUrl } from '../../Utils'
import AppLinkSwitcherButton from '../../components/AppButton/AppLinkSwitcherButton'

const ChatroomMessageComposer = ({ inputRef, scrollToBottom, roomId }) => {
  const [ message, setMessage ] = useState('')
  const [ sending, setSending ] = useState(false)
  const [ urlMode, setUrlMode ] = useState(false)

  const sendMessage = () => {
    if (urlMode) {
      setSending(true)

      validateImageUrl(message, () => {
        if (inputRef.current) inputRef.current.focus()
        firebaseHandler.sendImage(roomId, message, () => {
          setSending(false); scrollToBottom()
          setUrlMode(false)
        }, (err) => {
          console.log(err)
          setSending(false)
        })
      }, (err) => {
        console.error(err)
        alert('Érvenytelen kép URL')
        setSending(false)
      })
    } else {
      if (!validateMessage(message)) return

      setSending(true)
      if (inputRef.current) inputRef.current.focus()
      firebaseHandler.sendMessage(roomId, message, () => {
        setSending(false); scrollToBottom()
      }, (err) => {
        console.log(err)
        setSending(false)
      })
    }
  }

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [ urlMode, inputRef ])

  return (
    <div className="chatroom-message-composer">
      <AppLinkSwitcherButton enabled={urlMode} onClick={() => setUrlMode(!urlMode)} />
      <AppInput inChat placeholder={urlMode ? 'Kép link' : 'Aa'} onChange={(text) => {
        setMessage(text)
      }} reference={inputRef} onSubmit={() => sendMessage()} />
      <AppSendButton sending={sending}
      disabled={!validateMessage(message)} onClick={() => sendMessage()} />
    </div>
  )
}

export default ChatroomMessageComposer
