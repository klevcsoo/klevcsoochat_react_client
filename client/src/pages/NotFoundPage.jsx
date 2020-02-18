import React from 'react'
import { useHistory } from 'react-router-dom'
import AppButton from '../components/AppButton/AppButton'

const NotFoundPage = () => {
  const history = useHistory()

  return (
    <div style={{
      position: 'absolute',
      top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)'
    }}>
      <p style={{
        fontSize: 150,
        textAlign: 'center',
        margin: 10
      }}><span aria-label="monkey" role="img">🙈</span></p>
      <h1 className="app-subtitle">Oldal nem található</h1>
      <AppButton text="Vissza" onClick={() => history.goBack()} />
    </div>
  )
}

export default NotFoundPage
