import React, { useState } from 'react'
import './AppInput.css'
import { useEffect } from 'react'

const AppInput = ({ placeholder, defaultValue, onChange, onSubmit, inChat, reference }) => {
  const [ value, setValue ] = useState(defaultValue || '')
  
  const submit = () => {
    if (!!onSubmit) onSubmit()
    setValue('')
  }

  useEffect(() => {
    if (!!onChange) onChange(value)
  }, [ value ])

  return (
    <input
      className={`app-input${inChat ? ' app-chat-input' : ''}`}
      placeholder={placeholder} value={value}
      onChange={(e) => setValue(e.target.value)}
      ref={reference}
      onKeyDown={(e) => e.key === 'Enter' ? submit() : null}>
    </input>
  )
}

export default AppInput
