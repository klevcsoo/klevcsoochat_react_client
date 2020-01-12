import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { appColours } from '../Contants'

const LoadingSpinner = () => {
  return (
    <div style={{
      width: 40, height: 40,
      fill: appColours.TEXT,
      margin: '10px auto'
    }}>
      <CircularProgress color="inherit" />
    </div>
  )
}

export default LoadingSpinner
