import React from 'react'
import './ChatroomPage.css'
import { firebaseHandler } from '../../Utils'
import cookie from 'react-cookies'
import AppMessageCard from '../../components/AppMessageCards/AppMessageCard'

const ChatroomMessageList = ({ list }) => {
  return (
    <div>
      {list.map((m) => {
        let idKey = list.indexOf(m)
        return <AppMessageCard {...m} key={idKey}
        incoming={!(m.author === cookie.load('username') || m.author === firebaseHandler.getUid())} />
      })}
    </div>
  )
}

export default ChatroomMessageList
