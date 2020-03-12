import React, { useState } from 'react'
import './AppInput.css'
import { useEffect } from 'react'

const AppInput = ({ placeholder, defaultValue, onChange, onSubmit, inChat, reference, pass }) => {
  const [ value, setValue ] = useState(defaultValue || '')
  
  const submit = () => {
    if (!!onSubmit) onSubmit()
    setValue('')
  }

  // Fuck off
  // eslint-disable-next-line
  useEffect(() => onChange(value), [ value ])

  return (
    <input
      type={!!pass ? 'password' : 'text'}
      className={`app-input${inChat ? ' app-chat-input' : ''}`}
      placeholder={placeholder} value={value}
      onChange={(e) => setValue(e.target.value)}
      ref={reference}
      onKeyDown={(e) => e.key === 'Enter' ? submit() : null}>
    </input>
  )
}

export default AppInput
