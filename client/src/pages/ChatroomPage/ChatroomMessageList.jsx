import React from 'react'
import './ChatroomPage.css'
import { firebaseHandler } from '../../Utils'
import cookie from 'react-cookies'
import AppMessageCard from '../../components/AppMessageCards/AppMessageCard'
import AppImageMessageCard from '../../components/AppMessageCards/AppImageMessageCard'

const ChatroomMessageList = ({ list }) => {
  return (
    <div>
      {list.map((m) => {
        let idKey = list.indexOf(m)
        console.log(m)
        return !!(m.url) ? (
          <AppImageMessageCard {...m} key={idKey}
          incoming={!(m.author === cookie.load('username') || m.author === firebaseHandler.getUid())} />
        ) : (
          <AppMessageCard {...m} key={idKey}
          incoming={!(m.author === cookie.load('username') || m.author === firebaseHandler.getUid())} />
        )
      })}
    </div>
  )
}

export default ChatroomMessageList
