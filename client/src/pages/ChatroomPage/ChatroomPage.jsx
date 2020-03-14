import React, { useState, useEffect, useRef } from 'react'
import './ChatroomPage.css'
import { useAuthUser, useChatroom } from '../../Utils'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { routes } from '../../Contants'

// Components
import LoadingSpinner from '../../components/LoadingSpinner'
import ChatroomMessageList from './ChatroomMessageList'
import ChatroomMessageComposer from './ChatroomMessageComposer'
import ChatroomImageInspect from './ChatroomImageInspect'
import PageTitleHeader from '../../components/PageTitleHeader/PageTitleHeader'

let loadedMessages = []

const ChatroomPage = () => {
  const history = useHistory()
  const roomId = useRouteMatch().params.chatroom_id
  const [ user, userLoading ] = useAuthUser()
  const [ chatroomMetadata, chatroomLoading ] = useChatroom(roomId, (msgs) => {
    msgs.forEach((m, i) => {
      if (!loadedMessages[i]) m.animation = true
      else m.animation = false
    })

    setMessages(msgs)
    loadedMessages = msgs
    scrollToBottom()
  }, (err) => {
    console.log(err)
    history.replace(`/notfound/${roomId}`)
  })
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const [ messages, setMessages ] = useState([])
  const [ currentImage, setCurrentImage ] = useState(null)

  const scrollToBottom = () => {
    if (bottomRef?.current) {
      bottomRef.current.scrollIntoView({ behaivor: 'smooth' })
    }
  }

  useEffect(() => {
    if (!userLoading && !user) {
      history.push(routes.HOME.concat(`?chat=${roomId}`))
    }
  }, [ user, userLoading, history, roomId ])

  return (
    <React.Fragment>
      <ChatroomImageInspect url={currentImage} onClose={() => setCurrentImage(null)} />
      <div>
        <PageTitleHeader previousPage="home" nextPage="settings"
        nextPath={routes.CHATROOM_SETTINGS.replace(':chatroom_id', roomId)}
        title={chatroomMetadata?.name || roomId} />
        {chatroomLoading ? (
          <div style={{
            position: 'fixed',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)'
          }}><LoadingSpinner /></div>
        ) : <ChatroomMessageList list={messages} onImageClick={(url) => setCurrentImage(url)} />}
        <div style={{ height: 100 }} ref={bottomRef}></div>
        <ChatroomMessageComposer scrollToBottom={scrollToBottom}
        inputRef={inputRef} roomId={roomId} />
      </div>
    </React.Fragment>
  )
}

export default ChatroomPage
