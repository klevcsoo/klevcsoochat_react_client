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
          { userLoading ? <LoadingOverlay /> : !user ? <HomePage /> : <Redirect to={ routes.DASHBOARD } /> }
        </Route>
        <Route path={ routes.DASHBOARD }>
          { userLoading ? <LoadingOverlay /> : !!user ? <DashBoardPage /> : <Redirect to={ routes.HOME } /> }
        </Route>
        <Route path={ routes.ACCOUNT_SETTINGS } component={ AccountPage } />
        <Route path={ routes.CREATE_CHATROOM } component={ CreateChatroomPage } />
        <Route exact path={ routes.CHATROOM } component={ ChatroomPage } />
        <Route path={ routes.CHATROOM_SETTINGS } component={ ChatroomSettingsPage } />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
