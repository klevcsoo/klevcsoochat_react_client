import React, { useState, useEffect, useRef } from 'react'
import './ChatroomPage.css'
import { firebaseHandler } from '../../Utils'
import { useRouteMatch, useHistory } from 'react-router-dom'

// Components
import LoadingSpinner from '../../components/LoadingSpinner'
import ChatroomNamePopup from './ChatroomNamePopup'
import ChatroomMessageList from './ChatroomMessageList'
import ChatroomMessageComposer from './ChatroomMessageComposer'
import ChatroomHeader from './ChatroomHeader'

const ChatroomPage = () => {
  const history = useHistory()
  const roomId = useRouteMatch().params.chatroom_id
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const [ loading, setLoading ] = useState(true)
  const [ messages, setMessages ] = useState([])

  const scrollToBottom = () => {
    if (bottomRef?.current) {
      bottomRef.current.scrollIntoView({ behaivor: 'smooth' })
    }
  }

  useEffect(() => {
    firebaseHandler.loadChatroom(roomId, (msgs) => {
      setMessages(msgs)
      setLoading(false)
      scrollToBottom()
    }, (err) => {
      console.log(err)
      history.replace(`/notfound/${roomId}`)
    })
  }, [ roomId, history ])

  return (
    <React.Fragment>
      <ChatroomNamePopup />
      <div>
        <ChatroomHeader roomId={roomId} />
        {loading ? (
          <div style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)'
          }}><LoadingSpinner /></div>
        ) : <ChatroomMessageList list={messages} />}
        <div style={{ height: 100 }} ref={bottomRef}></div>
        <ChatroomMessageComposer scrollToBottom={scrollToBottom}
        inputRef={inputRef} roomId={roomId} />
      </div>
    </React.Fragment>
  )
}

export default ChatroomPage
