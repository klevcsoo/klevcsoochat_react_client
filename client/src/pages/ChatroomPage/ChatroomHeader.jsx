import React from 'react'

const ChatroomHeader = ({ roomId }) => {
  return (
    <div className="chatroom-header frosted-glass">
      <div><h1 className="app-subtitle" style={{ margin: 0 }}>Chat::<b>{roomId}</b></h1></div>
    </div>
  )
}

export default ChatroomHeader
