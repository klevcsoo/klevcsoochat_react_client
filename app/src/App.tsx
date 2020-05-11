import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { routes } from './utils/constants';

// Pages
import HomePage from './pages/HomePage/HomePage';
import AccountPage from './pages/AccountPage/AccountPage';
import CreateChatroomPage from './pages/CreateChatroomPage/CreateChatroomPage';
import ChatroomPage from './pages/ChatroomPage/ChatroomPage';
import ChatroomSettingsPage from './pages/ChatroomSettingsPage/ChatroomSettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={routes.HOME} component={HomePage} />
        <Route path={routes.ACCOUNT_SETTINGS} component={AccountPage} />
        <Route path={routes.CREATE_CHATROOM} component={CreateChatroomPage} />
        <Route exact path={routes.CHATROOM} component={ChatroomPage} />
        <Route path={routes.CHATROOM_SETTINGS} component={ChatroomSettingsPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
