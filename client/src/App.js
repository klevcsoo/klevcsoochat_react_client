import React from 'react'
import './App.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { routes } from './Contants'

// Pages
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ChatroomPage from './pages/ChatroomPage'
import SettingPage from './pages/SettingPage'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path={routes.HOME} component={HomePage} />
          <Route path={routes.SETTINGS} component={SettingPage} />
          <Route path={routes.CHATROOM} component={ChatroomPage} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
