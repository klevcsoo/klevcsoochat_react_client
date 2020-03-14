import React from 'react'
import './ChatroomPage.css'
import AppMessageCard from '../../components/AppMessageCards/AppMessageCard'
import AppImageMessageCard from '../../components/AppMessageCards/AppImageMessageCard'

const ChatroomMessageList = ({ list, onImageClick }) => {
  return (
    <div style={{ overflowX: 'hidden' }}>
      {list.map((m) => {
        let idKey = list.indexOf(m)
        return !!(m.url) ? (
          <AppImageMessageCard messa key={idKey}
          onClick={() => onImageClick(m.url)} />
        ) : (
          <AppMessageCard messageObject={m} key={idKey} />
        )
      })}
    </div>
  )
}

export default ChatroomMessageList
