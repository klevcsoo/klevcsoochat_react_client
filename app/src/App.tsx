import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { routes } from './utils/constants';

// Pages
import HomePage from './pages/HomePage/HomePage';
import AccountPage from './pages/AccountPage/AccountPage';
import CreateChatroomPage from './pages/CreateChatroomPage/CreateChatroomPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={routes.HOME} component={HomePage} />
        <Route exact path={routes.ACCOUNT_SETTINGS} component={AccountPage} />
        <Route exact path={routes.CREATE_CHATROOM} component={CreateChatroomPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
