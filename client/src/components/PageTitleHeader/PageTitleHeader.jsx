import React from 'react'
import './PageTitleHeader.css'
import {
  ArrowBackIosRounded,
  ArrowForwardIosRounded,
  HomeRounded,
  ChatRounded,
  SettingsRounded
} from '@material-ui/icons'
import { useHistory } from 'react-router-dom'

const PageTitleHeader = ({ previousPage, nextPage, nextPath,  title }) => {
  const history = useHistory()

  const getPreviousIcon = () => {
    switch (previousPage) {
      case 'home': return <HomeRounded color="inherit" />
      case 'chat': return <ChatRounded color="inherit" />
      case 'settings': return <SettingsRounded color="inherit" />
      default: return null
    }
  }

  const getNextIcon = () => {
    switch (nextPage) {
      case 'home': return <HomeRounded color="inherit" />
      case 'chat': return <ChatRounded color="inherit" />
      case 'settings': return <SettingsRounded color="inherit" />
      default: return null
    }
  }

  return (
    <div className="page-title-header frosted-glass">
      <div onClick={() => history.goBack()}>
        <ArrowBackIosRounded color="inherit" />
        {getPreviousIcon()}
      </div>
      <h1>{title}</h1>
      <div onClick={() => history.push(nextPath)}>
        {getNextIcon()}
        <ArrowForwardIosRounded color="inherit" />
      </div>
    </div>
  )
}

export default PageTitleHeader
