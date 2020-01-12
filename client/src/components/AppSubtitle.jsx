import React from 'react'

const AppSubtitle = ({ text, noMargin }) => {
  return (
    <h1 style={{
      fontSize: 20,
      fontWeight: 300,
      opacity: 0.8,
      textAlign: 'center',
      margin: noMargin ? 0 : 10
    }}>{text}</h1>
  )
}

export default AppSubtitle
