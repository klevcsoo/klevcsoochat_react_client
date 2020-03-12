import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { routes } from './Contants'

// Pages
import HomePage from './pages/HomePage/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ChatroomPage from './pages/ChatroomPage/ChatroomPage'
import UserSettingsPage from './pages/UserSettingsPage/UserSettingsPage'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path={routes.HOME} component={HomePage} />
          <Route path={routes.USER_SETTINGS} component={UserSettingsPage} />
          <Route path={routes.CHATROOM} component={ChatroomPage} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
