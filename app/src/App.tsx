import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { routes } from './utils/constants';

// Pages
import HomePage from './pages/HomePage/HomePage';
import AccountPage from './pages/AccountPage/AccountPage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={routes.HOME} component={HomePage} />
        <Route exact path={routes.ACCOUNT_SETTINGS} component={AccountPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
