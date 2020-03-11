import React, { useState, useEffect } from 'react'
import './HomePage.css'
import { useHistory } from 'react-router-dom'
import { firebaseHandler, useAuthUser } from '../../Utils'
import { routes } from '../../Contants'

// Components
import AppLogo from '../../components/AppLogo'
import AppInput from '../../components/AppInput/AppInput'
import AppButton from '../../components/AppButton/AppButton'
import LoadingSpinner from '../../components/LoadingSpinner'

const HomePage = () => {
  const history = useHistory()
  const redirectRoomId = history.location.search.replace('?chat=', '')
  const [ user, userLoading ] = useAuthUser()
  const [ email, setEmail ] = useState('')
  const [ pass, setPass ] = useState('')
  const [ roomId, setRoomId ] = useState('')

  console.log(redirectRoomId)

  const attemptJoinChat = () => {
    if (!roomId) history.push(routes.CREATE_CHATROOM)
    else history.push(routes.HOME.concat(`chat/${roomId}`))
  }

  const attemptLogin = () => {
    if (!email || !pass) alert('Hiányzó adatok!')
    else firebaseHandler.login(email, pass)
  }

  useEffect(() => {
    if (!!redirectRoomId && !!user) {
      history.push(routes.HOME.concat(`chat/${redirectRoomId}`))
    }
  }, [ user, redirectRoomId, history ])

  return (
    <div>
      <div className="home-logo"><AppLogo/></div>
      <div className="home-content-container">
        {userLoading ? <LoadingSpinner /> : !!user ? (
          <React.Fragment>
            <h1 className="app-subtitle" onClick={() => firebaseHandler.logout()}>
              <span style={{ fontSize: 30 }}>Bejelentkezve!</span><br/>
              {user.email}<br/>
              {user.displayName}
            </h1>
            <div className="home-option-separator"></div>
            <div>
            <AppInput placeholder="Szoba azonosító" onChange={(text) => setRoomId(text)}
            onSubmit={() => attemptJoinChat()} />
            <AppButton text={!!roomId ? 'Csatlakozás' : 'Szoba létrehozása'}
            onClick={() => attemptJoinChat()} />
          </div>
          </React.Fragment>
        ) : (
          <div>
            <AppInput placeholder="E-mail cím" onChange={(text) => setEmail(text)}
            onSubmit={() => attemptLogin()} />
            <AppInput placeholder="Jelszó" pass onChange={(text) => setPass(text)}
            onSubmit={() => attemptLogin()} />
            <AppButton text="Bejelentkezés" onClick={() => attemptLogin()} />
          </div>
        )}
      </div>
    </div>
  )
}

export default HomePage
