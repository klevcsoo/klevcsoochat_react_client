import React from 'react'
import './ChatroomPage.css'

const ChatroomImageInspect = ({ url, onClose }) => {
  return !url ? null : (
    <div className="chatroom-image-inspect" onClick={() => onClose()}>
      <img src={url} alt="Betöltés..."/>
    </div>
  )
}

export default ChatroomImageInspect
