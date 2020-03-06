import React from 'react'
import './AppButton.css'
import { LinkRounded } from '@material-ui/icons'

const AppURLModeSwitcherButton = ({ enabled, onClick }) => {
  const handleClick = () => setTimeout(() => onClick(), 200)

  return (
    <div className={`app-toggle-button${enabled ? ' enabled' : ''}`}
    onClick={handleClick}>
      <LinkRounded color="inherit" />
    </div>
  )
}

export default AppURLModeSwitcherButton
