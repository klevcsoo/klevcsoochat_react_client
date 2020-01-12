import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { firebaseHandler } from '../Utils'
import { routes } from '../Contants'

// Components
import AppTitle from '../components/AppTitle'
import AppButton from '../components/AppButton/AppButton'
import AppInput from '../components/AppInput/AppInput'
import LoadingSpinner from '../components/LoadingSpinner'
import AppSubtitle from '../components/AppSubtitle'

const HomePage = () => {
  const history = useHistory()
  const [ username, setUsername ] = useState('')
  const [ roomId, setRoomId ] = useState('')
  const [ creating, setCreating ] = useState(false)

  const joinChatroom = () => {
    history.push(routes.HOME.concat(roomId))
  }

  const createChatroom = () => {
    setCreating(true)
    firebaseHandler.createChatroom((id) => {
      history.push(routes.HOME.concat(id))
    }, (err) => {
      console.log(err) //TODO: Add popup
      setCreating(false)
    })
  }

  return (
    <div>
      <div style={{
        position: 'absolute',
        top: '25%', left: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        <AppTitle text="Klevchat" />
      </div>
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'grid',
        gridRow: 'repeat(5, auto)'
      }}>
        <AppInput placeholder="Felhasználónév (elhagyható)" defaultValue={username} onChange={(text) => {
          setUsername(text)
        }}  />
        <AppInput placeholder="Chat azonosító" defaultValue={roomId} onChange={(text) => {
          setRoomId(text)
        }}  />
        <AppButton text="Csatlakozás a szobához" onClick={() => joinChatroom()} />
        <AppSubtitle text="vagy" />
        {creating ? <LoadingSpinner /> : <AppButton text="Szoba létrehozása" onClick={() => createChatroom()}  />}
      </div>
    </div>
  )
}

export default HomePage
