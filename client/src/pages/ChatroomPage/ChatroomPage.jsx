import React, { useState, useEffect, useRef } from 'react'
import { firebaseHandler } from '../../Utils'
import { useRouteMatch } from 'react-router-dom'
import { appColours } from '../../Contants'
import cookie from 'react-cookies'

// Components
import AppInput from '../../components/AppInput/AppInput'
import LoadingSpinner from '../../components/LoadingSpinner'
import AppSubtitle from '../../components/AppSubtitle'
import AppSendButton from '../../components/AppButton/AppSendButton'
import AppMessageCardOG from '../../components/AppMessageCards/AppMessageCardOG'
import AppMessageCardIC from '../../components/AppMessageCards/AppMessageCardIC'

const ChatroomPage = () => {
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
    })
  }, [ roomId ])

  return (
    <div>
      <div style={{
        position: 'fixed',
        top: 0, left: 0,
        zIndex: 110,
        width: '100vw', height: 44,
        background: appColours.FOREGROUND,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        display: 'grid',
        gridTemplateRows: 'auto min-content auto'
      }}>
        <div style={{ gridRow: '2 / span 1' }}>
          <AppSubtitle text={(<>Chat::<b>{roomId}</b></>)} noMargin />
        </div>
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
      <div style={{
        position: 'fixed',
        bottom: 0, left: 0,
        zIndex: 100,
        width: '100vw', height: 50,
        paddingBottom: 34,
        background: appColours.FOREGROUND,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        display: 'grid',
        gridTemplateColumns: 'auto min-content'
      }}>
        <AppInput inChat placeholder="Aa" defaultValue={currentMsg} onChange={(text) => {
          setCurrentMsg(text)
        }} reference={inputRef} />
        {sending ? <LoadingSpinner /> : (
          <AppSendButton disabled={currentMsg.length === 0} onClick={() => {
            setSending(true)
            if (inputRef.current) inputRef.current.focus()
            firebaseHandler.sendMessage(roomId, currentMsg, () => {
              console.log('Sent')
              setCurrentMsg('')
              setSending(false)
              if (bottomRef.current) bottomRef.current.scrollIntoView({ behaivor: 'smooth' })
            }, (err) => {
              console.log(err)
            })
          }} />
        )}
      </div>
    </div>
  )
}

export default ChatroomPage
