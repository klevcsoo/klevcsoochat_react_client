import React from 'react'
import './ChatroomPage.css'
import { firebaseHandler } from '../../Utils'
import cookie from 'react-cookies'
import AppMessageCardOG from '../../components/AppMessageCards/AppMessageCardOG'
import AppMessageCardIC from '../../components/AppMessageCards/AppMessageCardIC'

const ChatroomMessageList = ({ list }) => {
  return (
    <div>
      {list.map((m) => {
        if (m.author === cookie.load('username') || m.author === firebaseHandler.getUid()) {
          return <AppMessageCardOG {...m} key={Math.random() * 10000}/>
        } else return <AppMessageCardIC {...m} key={Math.random() * 10000}/>
      })}
    </div>
  )
}

export default ChatroomMessageList
