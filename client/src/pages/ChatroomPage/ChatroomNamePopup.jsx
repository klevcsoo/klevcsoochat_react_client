import React, { useState } from 'react'
import './ChatroomPage.css'
import cookie from 'react-cookies'
import AppInput from '../../components/AppInput/AppInput'
import AppButton from '../../components/AppButton/AppButton'

const ChatroomNamePopup = () => {
  const [ hasUsername, setHasUsername ] = useState(!!cookie.load('username'))
  const [ username, setUsername ] = useState('')

  return hasUsername ? null : (
    <div className="chatroom-username-popup">
      <div>
        <AppInput placeholder="Felhasználónév" defaultValue={username} onChange={(text) => {
          setUsername(text)
        }} />
        <AppButton text="Tovább" onClick={() => {
          if (!username) alert('Nincs megadva felhasználónév!')
          else {
            cookie.save('username', username)
            console.log('Username: ', username)
            setHasUsername(true)
          }
        }} />
      </div>
    </div>
  )
}

export default ChatroomNamePopup
