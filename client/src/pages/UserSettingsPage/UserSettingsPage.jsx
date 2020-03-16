import React, { useState } from 'react'
import './UserSettingsPage.css'
import { useAuthUser, firebaseHandler } from '../../Utils'

// Components
import LoadingSpinner from '../../components/LoadingSpinner'
import AppInput from '../../components/AppInput/AppInput'
import AppButton from '../../components/AppButton/AppButton'
import PageTitleHeader from '../../components/PageTitleHeader/PageTitleHeader'

const UserSettingsPage = () => {
  const [ user, userLoading ] = useAuthUser()
  const [ photoURL, setPhotoURL ] = useState('')
  const [ displayName, setDisplayName ] = useState('')
  const [ password, setPassword ] = useState({ current: '', new: '' })
  const [ updating, setUpdating ] = useState(false)

  const changePhoto = () => {
    setUpdating(true)
    firebaseHandler.updateUserInfo({ photo: photoURL }, () => {
      setUpdating(false)
    }, (err) => {
      console.log('Failed to update photo:', err.message)
      setUpdating(false)
    })
  }

  const changeDisplayName = () => {
    setUpdating(true)
    firebaseHandler.updateUserInfo({ name: displayName }, () => {
      setUpdating(false)
    }, (err) => {
      console.log('Failed to update name:', err.message)
      setUpdating(false)
    })
  }

  const changePassword = () => {
    setUpdating(true)
    firebaseHandler.updateUserPassword({
      currentPass: password.current,
      newPass: password.new
    }, () => {
      setUpdating(false)
    }, (err) => {
      console.log('Failed to update password:', err.message)
      setUpdating(false)
    })
  }

  return (
    <div>
      <PageTitleHeader previousPage="home" title="Fiókbeállítások" />
      {userLoading ? <LoadingSpinner /> : (
        <React.Fragment>
          <div className="app-card">
            <img src={user.photoURL} alt="Profilkép" className="user-settings-photo"/>
            <AppInput placeholder="Profilkép link" defaultValue={user.photoURL}
            onChange={(text) => setPhotoURL(text)} onSubmit={() => changePhoto()} />
            <AppButton text="Megváltoztatás" onClick={() => changePhoto()}
            loading={updating} />
          </div>
          <div className="app-card">
            <AppInput placeholder="Név" defaultValue={user.displayName}
            onChange={(text) => setDisplayName(text)} onSubmit={() => changeDisplayName()} />
            <AppButton text="Név frissítése" onClick={() => changeDisplayName()}
            loading={updating} />
          </div>
          <div className="app-card">
            <AppInput placeholder="Jelenlegi jelszó" onChange={(text) => {
              setPassword({ current: text, new: password.new })
            }} onSubmit={() => changePassword()} />
            <AppInput placeholder="Új jelszó" onChange={(text) => {
              setPassword({ current: password.current, new: text })
            }} onSubmit={() => changePassword()} />
            <AppButton text="Jelszó frissítése" onClick={() => changePassword()}
            loading={updating} />
          </div>
        </React.Fragment>
      )}
    </div>
  )
}

export default UserSettingsPage
