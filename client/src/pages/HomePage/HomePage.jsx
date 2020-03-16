import React, { useState, useEffect } from 'react'
import './HomePage.css'
import { useHistory } from 'react-router-dom'
import { firebaseHandler, useAuthUser } from '../../Utils'
import { routes } from '../../Contants'
import { SettingsRounded } from '@material-ui/icons'

// Components
import AppLogo from '../../components/AppLogo'
import AppInput from '../../components/AppInput/AppInput'
import AppButton from '../../components/AppButton/AppButton'
import LoadingSpinner from '../../components/LoadingSpinner'
import AppWarningButton from '../../components/AppButton/AppWarningButton'

const HomePage = () => {
  const history = useHistory()
  const redirectRoomId = history.location.search.replace('?chat=', '')
  const [ user, userLoading ] = useAuthUser()
  const [ email, setEmail ] = useState('')
  const [ pass, setPass ] = useState('')
  const [ roomId, setRoomId ] = useState('')
  const [ logginIn, setLoggingIn ] = useState(false)
  const [ savedRooms, setSavedRooms ] = useState([])

  const attemptJoinChat = (id) => {
    if (!!id) {
      history.push(routes.HOME.concat(`chat/${id}`))
    }
    else {
      if (!roomId) history.push(routes.CREATE_CHATROOM)
      else history.push(routes.HOME.concat(`chat/${roomId}`))
    }
  }

  const attemptLogin = () => {
    if (!email || !pass) alert('Hiányzó adatok!')
    else {
      setLoggingIn(true)
      firebaseHandler.login(email, pass)
    }
  }

  useEffect(() => {
    if (!!redirectRoomId && !!user) {
      history.push(routes.HOME.concat(`chat/${redirectRoomId}`))
    }
  }, [ user, redirectRoomId, history ])

  useEffect(() => {
    if (!!user) setLoggingIn(false)
  }, [ user ])

  useEffect(() => {
    firebaseHandler.loadSavedChatrooms((list) => {
      setSavedRooms(list)
    })
  }, [])

  return (
    <div>
      <div className="home-logo"><AppLogo/></div>
      <div className="home-content-container">
        {userLoading ? <LoadingSpinner /> : !!user ? (
          <React.Fragment>
            <h1 className="app-subtitle">
              <span style={{ fontSize: 30 }}>Bejelentkezve!</span><br/>
              {user.email}<br/>
              {user.displayName}
            </h1>
            <span className="home-settings-link" onClick={() => {
              history.push(routes.USER_SETTINGS)
            }}><SettingsRounded color="inherit" /> Beállítások</span>
            <div className="home-option-separator"></div>
            <div>
              <AppInput placeholder="Szoba azonosító" onChange={(text) => setRoomId(text)}
              onSubmit={() => attemptJoinChat()} />
              <AppButton text={!!roomId ? 'Csatlakozás' : 'Szoba létrehozása'}
              onClick={() => attemptJoinChat()} />
              <div className="app-card">
                {savedRooms.map((id, index) => (
                  <span className="home-saved-room" key={index}
                  onClick={() => attemptJoinChat(id)}>
                    <h1 className="app-subtitle">{id}</h1>
                  </span>
                ))}
              </div>
            </div>
            <div className="home-option-separator"></div>
            <AppWarningButton text="Kijelentezés" onClick={() => firebaseHandler.logout()} />
          </React.Fragment>
        ) : (
          <div>
            <AppInput placeholder="E-mail cím" onChange={(text) => setEmail(text)}
            onSubmit={() => attemptLogin()} />
            <AppInput placeholder="Jelszó" pass onChange={(text) => setPass(text)}
            onSubmit={() => attemptLogin()} />
            <AppButton text="Bejelentkezés" onClick={() => attemptLogin()} loading={logginIn} />
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
