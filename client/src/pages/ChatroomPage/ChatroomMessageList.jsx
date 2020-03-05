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
        let idKey = list.indexOf(m)

        if (m.author === cookie.load('username') || m.author === firebaseHandler.getUid()) {
          return <AppMessageCardOG {...m} key={idKey}/>
        } else return <AppMessageCardIC {...m} key={idKey}/>
      })}
    </div>
  )
}

export default ChatroomMessageList
