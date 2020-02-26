import React, { useState } from 'react'
import './ChatroomPage.css'
import cookie from 'react-cookies'
import AppInput from '../../components/AppInput/AppInput'
import AppButton from '../../components/AppButton/AppButton'

const ChatroomNamePopup = () => {
  const [ hasUsername, setHasUsername ] = useState(!!cookie.load('username'))
  const [ username, setUsername ] = useState('')

  const saveUsername = () => {
    if (!username) alert('Nincs megadva felhasználónév!')
    else {
      cookie.save('username', username)
      console.log('Username updated: ', username)
      setHasUsername(true)
    }
  }

  return hasUsername ? null : (
    <div className="chatroom-username-popup">
      <div>
        <AppInput placeholder="Felhasználónév" defaultValue={username} onChange={(text) => {
          setUsername(text)
        }} onSubmit={() => saveUsername()} />
        <AppButton text="Tovább" onClick={() => saveUsername()} />
      </div>
    </div>
  )
}

export default ChatroomNamePopup
