import React from 'react'
import './AppInput.css'

const AppInput = ({ placeholder, defaultValue, onChange, onSubmit, inChat, reference }) => {
  return (
    <input
      className={`app-input${inChat ? ' app-chat-input' : ''}`}
      placeholder={placeholder} value={defaultValue || ''}
      onChange={(e) => {
        if (onChange) onChange(e.target.value)
      }}
      ref={reference}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onSubmit) onSubmit()
      }}>
    </input>
  )
}

export default AppInput
