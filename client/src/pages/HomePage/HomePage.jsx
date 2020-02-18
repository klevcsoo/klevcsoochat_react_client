import React, { useState, useEffect } from 'react'
import './HomePage.css'
import { useHistory } from 'react-router-dom'
import { firebaseHandler } from '../../Utils'
import { routes } from '../../Contants'
import cookie from 'react-cookies'

// Components
import AppButton from '../../components/AppButton/AppButton'
import AppInput from '../../components/AppInput/AppInput'
import LoadingSpinner from '../../components/LoadingSpinner'
import AppLogo from '../../components/AppLogo'

const HomePage = () => {
  const history = useHistory()
  const [ username, setUsername ] = useState('')
  const [ roomId, setRoomId ] = useState('')
  const [ creating, setCreating ] = useState(false)

  const joinChatroom = () => {
    saveUsername()
    history.push(routes.HOME.concat(`chat/${roomId}`))
  }

  const createChatroom = () => {
    setCreating(true)
    saveUsername()
    firebaseHandler.createChatroom((id) => {
      history.push(routes.HOME.concat(`chat/${id}`))
    }, (err) => {
      alert(err)
      setCreating(false)
    })
  }

  const saveUsername = () => {
    if (!username) cookie.remove('username')
    else cookie.save('username', username)

    console.log(cookie.load('username'))
  }

  useEffect(() => {
    let cachedUsername = cookie.load('username')
    if (!!cachedUsername) setUsername(cachedUsername)
  }, [])

  return (
    <div>
      <div className="home-logo"><AppLogo/></div>
      <div className="home-content-container">
        <div><div>
          <AppInput placeholder="Felhasználónév" defaultValue={username} onChange={(text) => {
            setUsername(text)
          }} />
          {creating ? <LoadingSpinner /> : <AppButton text="Szoba létrehozása" onClick={() => {
            if (!username) alert('Nincs megadva felhasználónév')
            else createChatroom()
          }}  />}
          <div className="home-option-separator"></div>
        </div></div>
        <div>
          <AppInput placeholder="Felhasználónév" defaultValue={username} onChange={(text) => {
            setUsername(text)
          }} />
          <AppInput placeholder="Chat azonosító" defaultValue={roomId} onChange={(text) => {
            setRoomId(text)
          }}  />
          <AppButton text="Csatlakozás a szobához" onClick={() => {
            if (!username) alert('Nincs megadva felhasználónév')
            else if (!!roomId) joinChatroom()
          }} />
        </div>
      </div>
    </div>
  )
}

export default HomePage
