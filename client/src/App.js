import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { routes } from './Contants'

// Pages
import HomePage from './pages/HomePage/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ChatroomPage from './pages/ChatroomPage/ChatroomPage'
import UserSettingsPage from './pages/UserSettingsPage/UserSettingsPage'
import CreateChatroomPage from './pages/CreateChatroomPage/CreateChatroomPage'
import ChatroomSettingsPage from './pages/ChatroomSettingsPage/ChatroomSettingsPage'

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path={routes.HOME} component={HomePage} />
          <Route path={routes.USER_SETTINGS} component={UserSettingsPage} />
          <Route path={routes.CREATE_CHATROOM} component={CreateChatroomPage} />
          <Route exact path={routes.CHATROOM} component={ChatroomPage} />
          <Route path={routes.CHATROOM_SETTINGS} component={ChatroomSettingsPage} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
