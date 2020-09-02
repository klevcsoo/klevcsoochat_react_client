import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { routes } from './utils/constants';
import { useAuthUser } from './utils/firebase';

// Pages
import HomePage from './pages/HomePage/HomePage';
import AccountPage from './pages/AccountPage/AccountPage';
import CreateChatroomPage from './pages/CreateChatroomPage/CreateChatroomPage';
import ChatroomPage from './pages/ChatroomPage/ChatroomPage';
import ChatroomSettingsPage from './pages/ChatroomSettingsPage/ChatroomSettingsPage';
import LoadingOverlay from './components/LoadingOverlay';
import DashBoardPage from './pages/DashboardPage/DashBoardPage';

function App() {
  const [ user, userLoading ] = useAuthUser();

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={ routes.HOME }>
          { userLoading ? <LoadingOverlay /> : !!user ? <Redirect to={ routes.DASHBOARD } /> : <HomePage /> }
        </Route>
        <Route path={ routes.DASHBOARD }>
          { userLoading ? <LoadingOverlay /> : !user ? <Redirect to={ routes.HOME } /> : (
            <React.Fragment>
              <Route exact path={ routes.DASHBOARD } component={ DashBoardPage } />
              <Route exact path={ routes.ACCOUNT_SETTINGS } component={ AccountPage } />
              <Route exact path={ routes.CREATE_CHATROOM } component={ CreateChatroomPage } />
              <Route exact path={ routes.CHATROOM } component={ ChatroomPage } />
              <Route exact path={ routes.CHATROOM_SETTINGS } component={ ChatroomSettingsPage } />
            </React.Fragment>
          ) }
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
