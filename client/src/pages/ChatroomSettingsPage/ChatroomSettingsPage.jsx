import React, { useState, useEffect } from 'react'
import './ChatroomSettingsPage.css'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { useChatroom, firebaseHandler, formatDate } from '../../Utils'

// Components
import PageTitleHeader from '../../components/PageTitleHeader/PageTitleHeader'
import AppButton from '../../components/AppButton/AppButton'
import LoadingSpinner from '../../components/LoadingSpinner'
import AppInput from '../../components/AppInput/AppInput'
import AppWarningButton from '../../components/AppButton/AppWarningButton'
import { routes } from '../../Contants'

const ChatroomSettingsPage = () => {
  const history = useHistory()
  const roomId = useRouteMatch().params.chatroom_id
  const [ metadata, chatroomLoading ] = useChatroom(roomId, () => null)
  const [ working, setWorking ] = useState(true)
  const [ chatroomSaved, setChatroomSaved ] = useState(false)
  const [ roomName, setRoomName ] = useState('')

  const saveChatroom = () => {
    firebaseHandler.saveChatroom(roomId, () => {
      setWorking(false)
      setChatroomSaved(true)
    })
  }

  const updateRoomName = () => {
    firebaseHandler.roomSettings().updateName(roomName, roomId)
  }

  useEffect(() => {
    firebaseHandler.checkChatroomSaved(roomId, (isSaved) => {
      setChatroomSaved(isSaved)
      setWorking(false)
    })
  }, [ roomId ])

  return (
    <div>
      <PageTitleHeader previousPage="chat" title="Szoba beállításai" />
      {chatroomLoading ? <LoadingSpinner /> : (
        <div>
          <h1 className="app-subtitle">
            <span style={{ fontWeight: 500 }}>Szoba azonosító: </span>
            {roomId}
          </h1>
          <h1 className="app-subtitle">
            <span style={{ fontWeight: 500 }}>Létrehozva: </span>
            {formatDate(metadata.created)}
          </h1>
          {chatroomSaved ? null : (
            <AppButton text="Szoba lementése" loading={working} onClick={saveChatroom} />
          )}
          <div className="app-card">
            <AppInput placeholder="Szoba neve" defaultValue={metadata.name} onChange={(text) => {
              setRoomName(text)
            }} onSubmit={updateRoomName} />
            <AppButton text="Módosítás" loading={working} onClick={updateRoomName} />
          </div>
          <div className="app-card">
            <AppWarningButton text="Üzenetek törlése" onClick={() => {
              firebaseHandler.roomSettings().deleteConversation(roomId)
            }} />
            <p className="chatroom-settings-action-description">
              A szobába írt összes üzenetet törli, a chat
              teljesen üres lesz, az üzenetek örökre törlődnek.
              Ez visszafordíthatatlan.
            </p>
            <AppWarningButton text="Szoba törlése" onClick={() => {
              firebaseHandler.roomSettings().deleteRoom(roomId, () => {
                history.replace(routes.HOME)
              }, (err) => alert(err))
            }} />
            <p className="chatroom-settings-action-description">
              Az egész szoba véglegesen törölve lesz beállításokkal
              együtt, így az eltűnik mindenkinek a listájából.
              Ez visszafordíthatatlan.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatroomSettingsPage
