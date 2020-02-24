import React, { useState, useEffect, useRef } from 'react'
import './ChatroomPage.css'
import { firebaseHandler } from '../../Utils'
import { useRouteMatch, useHistory } from 'react-router-dom'

// Components
import LoadingSpinner from '../../components/LoadingSpinner'
import ChatroomNamePopup from './ChatroomNamePopup'
import ChatroomMessageList from './ChatroomMessageList'
import ChatroomMessageComposer from './ChatroomMessageComposer'

const ChatroomPage = () => {
  const history = useHistory()
  const roomId = useRouteMatch().params.chatroom_id
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const [ loading, setLoading ] = useState(true)
  const [ sending, setSending ] = useState(false)
  const [ messages, setMessages ] = useState([])
  const [ currentMsg, setCurrentMsg ] = useState('')

  useEffect(() => {
    firebaseHandler.loadChatroom(roomId, (msgs) => {
      setMessages(msgs)
      setLoading(false)
      if (bottomRef?.current) bottomRef.current.scrollIntoView({ behaivor: 'smooth' })
    }, (err) => {
      console.log(err)
      history.replace('/notfound')
    })
  }, [ roomId, history ])

  const sendMessage = () => {
    setSending(true)
    if (inputRef.current) inputRef.current.focus()
    firebaseHandler.sendMessage(roomId, currentMsg, () => {
      console.log('Sent')
      setCurrentMsg('')
      setSending(false)
      if (bottomRef?.current) bottomRef.current.scrollIntoView({ behaivor: 'smooth' })
    }, (err) => {
      console.log(err)
    })
  }

  return (
    <React.Fragment>
      <ChatroomNamePopup />
      <div>
        <div className="chatroom-header">
          <div><h1 className="app-subtitle" style={{ margin: 0 }}>Chat::<b>{roomId}</b></h1></div>
        </div>
        {loading ? (
          <div style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)'
          }}><LoadingSpinner /></div>
        ) : <ChatroomMessageList list={messages} />}
        <div style={{ height: 100 }} ref={bottomRef}></div>
        <ChatroomMessageComposer messageHandling={{ currentMsg, setCurrentMsg }} inputRef={inputRef}
        isSending={sending} sendMessage={sendMessage} />
      </div>
    </React.Fragment>
  )
}

export default ChatroomPage
