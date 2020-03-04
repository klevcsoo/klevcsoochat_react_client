import React from 'react'
import './AppInput.css'

const AppInput = ({ placeholder, defaultValue, onSubmit, inChat, reference }) => {
  return (
    <input
      className={`app-input${inChat ? ' app-chat-input' : ''}`}
      placeholder={placeholder} defaultValue={defaultValue || ''}
      ref={reference}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onSubmit) onSubmit()
      }}>
    </input>
  )
}

export default AppInput
