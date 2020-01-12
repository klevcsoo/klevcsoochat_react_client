import React, { useEffect } from 'react'
import './AppInput.css'

const AppInput = ({ placeholder, defaultValue, onChange, inChat, reference }) => {
  return (
    <input
      className={`app-input${inChat ? ' app-chat-input' : ''}`}
      placeholder={placeholder} value={defaultValue || ''}
      onChange={(e) => {
        if (onChange) onChange(e.target.value)
      }}
      ref={reference}>
    </input>
  )
}

export default AppInput
