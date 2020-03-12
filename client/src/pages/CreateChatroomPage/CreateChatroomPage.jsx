import React, { useState } from 'react'
import './CreateChatroomPage.css'
import { firebaseHandler } from '../../Utils'
import { useHistory } from 'react-router-dom'
import { routes } from '../../Contants'

// Components
import PageTitleHeader from '../../components/PageTitleHeader/PageTitleHeader'
import AppInput from '../../components/AppInput/AppInput'
import AppButton from '../../components/AppButton/AppButton'

const CreateChatroomPage = () => {
  const history = useHistory()
  const [ roomName, setRoomName ] = useState('')
  // const [ roomId, setRoomId ] = useState('')
  // const [ roomPass, setRoomPass ] = useState('')
  const [ creating, setCreating ] = useState(false)

  const createRoom = () => {
    setCreating(true)
    firebaseHandler.createChatroom({ name: roomName }, (id) => {
      history.push(routes.HOME.concat(`chat/${id}`))
    }, (err) => {
      console.error('Failed to create chatroom: ', err.message)
      setCreating(false)
    })
  }

  return (
    <div>
      <PageTitleHeader previousPage="home" title="Szoba létrehozása" />
      <div className="app-card">
        <AppInput placeholder="Név" onChange={(text) => setRoomName(text)}
        onSubmit={() => createRoom()} />
        <p className="create-chatroom-input-description">
          A szoba neve. Később módosítható.
        </p>
      </div>
      {/* CUSTOM ROOM ID IS NOT AVAILABLE FOR NOW */}
      {/* Database structure is not ready for chatroom
          creation with custom id. */}
      {/* <div className="app-card">
        <AppInput placeholder="Azonosító (nem kötelező)" onChange={(text) => setRoomId(text)}
        onSubmit={() => createRoom()} />
        <p className="create-chatroom-input-description">
          Nem kötelező megadni. Egyéni azonosítónak egyedinek is
          kell lennie, szóval nem lehet két szoba ugyanazzal
          az azonosítóval. Ezt az azonosítót lehet továbbadni,
          ezzel lehet csatlakozni a szobához. Később NEM módosítható.
        </p>
      </div> */}
      {/* PASSWORD PROTECTED CHATROOMS ARE NOT AVAILABLE FOR NOW */}
      {/* Back-end and Firebase functions are not set up for
          password protected chatrooms. */}
      {/* <div className="app-card">
        <AppInput placeholder="Jelszó (nem kötelező)" onChange={(text) => setRoomPass(text)}
        onSubmit={() => createRoom()} />
        <p className="create-chatroom-input-description">
          A szobához való csatlakozáshoz szükséges jelszó.
          Ha egy publikus szobát szeretnél létrehozni, a
          jelszó elhagyható. Később módosítható.
        </p>
      </div> */}
      <AppButton text="Létrehozás" onClick={() => createRoom()} loading={creating} />
    </div>
  )
}

export default CreateChatroomPage
