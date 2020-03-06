import React from 'react'
import './ChatroomPage.css'
import { firebaseHandler } from '../../Utils'
import cookie from 'react-cookies'
import AppMessageCard from '../../components/AppMessageCards/AppMessageCard'
import AppImageMessageCard from '../../components/AppMessageCards/AppImageMessageCard'

const ChatroomMessageList = ({ list, onImageClick }) => {
  return (
    <div>
      {list.map((m) => {
        let idKey = list.indexOf(m)
        return !!(m.url) ? (
          <AppImageMessageCard {...m} key={idKey}
          incoming={!(m.author === cookie.load('username') || m.author === firebaseHandler.getUid())}
          onClick={() => onImageClick(m.url)} />
        ) : (
          <AppMessageCard {...m} key={idKey}
          incoming={!(m.author === cookie.load('username') || m.author === firebaseHandler.getUid())} />
        )
      })}
    </div>
  )
}

export default ChatroomMessageList
