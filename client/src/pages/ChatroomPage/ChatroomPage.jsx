import React, { useState, useEffect, useRef } from 'react'
import './ChatroomPage.css'
import { firebaseHandler } from '../../Utils'
import { useRouteMatch, useHistory } from 'react-router-dom'
import cookie from 'react-cookies'

// Components
import AppInput from '../../components/AppInput/AppInput'
import LoadingSpinner from '../../components/LoadingSpinner'
import AppSendButton from '../../components/AppButton/AppSendButton'
import AppMessageCardOG from '../../components/AppMessageCards/AppMessageCardOG'
import AppMessageCardIC from '../../components/AppMessageCards/AppMessageCardIC'
import ChatroomNamePopup from './ChatroomNamePopup'

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
    }, (err) => {
      console.log(err)
      history.replace('/notfound')
    })
  }, [ roomId, history ])

  useEffect(() => {
    if (bottomRef?.current) {
      bottomRef.current.scrollIntoView({ behaivor: 'smooth' })
    }
  }, [ bottomRef ])

  const sendMessage = () => {
    setSending(true)
    if (inputRef.current) inputRef.current.focus()
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behaivor: 'smooth' })
    firebaseHandler.sendMessage(roomId, currentMsg, () => {
      console.log('Sent')
      setCurrentMsg('')
      setSending(false)
      if (bottomRef.current) bottomRef.current.scrollIntoView({ behaivor: 'smooth' })
    }, (err) => {
      console.log(err)
    })
  }

  return (
    <div>
      <ChatroomNamePopup />
      <div className="chatroom-header">
        <div><h1 className="app-subtitle" style={{ margin: 0 }}>Chat::<b>{roomId}</b></h1></div>
      </div>
      <div style={{ height: 50 }}></div>
      {loading ? (
        <div style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)'
        }}><LoadingSpinner /></div>
      ) : (
        <div style={{ overflow: 'scroll' }}>
          {messages.map((m) => {
            if (m.author === cookie.load('username') || m.author === firebaseHandler.getUid()) {
              return <AppMessageCardOG {...m} key={Math.random() * 10000}/>
            } else return <AppMessageCardIC {...m} key={Math.random() * 10000}/>
          })}
        </div>
      )}
      <div style={{ height: 100 }} ref={bottomRef}></div>
      <div className="chatroom-message-composer">
        <AppInput inChat placeholder="Aa" defaultValue={currentMsg} onChange={(text) => {
          setCurrentMsg(text)
        }} reference={inputRef} onSubmit={() => sendMessage()} />
        {sending ? <LoadingSpinner /> : (
          <AppSendButton disabled={currentMsg.length === 0} onClick={() => sendMessage()} />
        )}
      </div>
    </div>
  )
}

export default ChatroomPage
