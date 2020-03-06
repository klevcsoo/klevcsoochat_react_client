import React from 'react'
import './AppButton.css'
import { LinkRounded } from '@material-ui/icons'

const AppLinkSwitcherButton = ({ enabled, onClick }) => {
  const handleClick = () => setTimeout(() => onClick(), 200)

  return (
    <div className={`app-link-switcher-button${enabled ? ' enabled' : ''}`}
    onClick={handleClick}>
      <LinkRounded color="inherit" />
    </div>
  )
}

export default AppLinkSwitcherButton
