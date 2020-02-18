import React, { useState, useEffect, useRef } from 'react'
import './ChatroomPage.css'
import { firebaseHandler } from '../../Utils'
import { useRouteMatch } from 'react-router-dom'
import { appColours } from '../../Contants'
import cookie from 'react-cookies'

// Components
import AppInput from '../../components/AppInput/AppInput'
import LoadingSpinner from '../../components/LoadingSpinner'
import AppSendButton from '../../components/AppButton/AppSendButton'
import AppMessageCardOG from '../../components/AppMessageCards/AppMessageCardOG'
import AppMessageCardIC from '../../components/AppMessageCards/AppMessageCardIC'

const ChatroomPage = () => {
  const roomId = useRouteMatch().params.chatroom_id
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const [ loading, setLoading ] = useState(true)
  const [ messages, setMessages ] = useState([])
  const [ currentMsg, setCurrentMsg ] = useState('')

  useEffect(() => {
    firebaseHandler.loadChatroom(roomId, (msgs) => {
      setMessages(msgs)
      setLoading(false)
    }, (err) => {
      console.log(err)
    })
  }, [ roomId ])

  return (
    <div>
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
        }} reference={inputRef} />
        <AppSendButton disabled={currentMsg.length === 0} onClick={() => {
          if (inputRef.current) inputRef.current.focus()
          firebaseHandler.sendMessage(roomId, currentMsg, () => {
            console.log('Sent')
            setCurrentMsg('')
            if (bottomRef.current) bottomRef.current.scrollIntoView({ behaivor: 'smooth' })
          }, (err) => {
            console.log(err)
          })
        }} />
      </div>
    </div>
  )
}

export default ChatroomPage
