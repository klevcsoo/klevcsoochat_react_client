import React from 'react'
import { ReactComponent as Logo } from '../assets/app_logo.svg'
import { appColours } from '../Contants'

const AppLogo = () => {
  return (
    <div style={{
      fill: appColours.TEXT,
      display: 'block',
      margin: 'auto',
      width: 'fit-content'
    }}><Logo/></div>
  )
}

export default AppLogo
