import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { routes } from './utils/constants';

// Pages
import HomePage from './pages/HomePage/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path={routes.HOME} component={HomePage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
