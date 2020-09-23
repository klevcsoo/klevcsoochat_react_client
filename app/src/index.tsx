import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { initializeCache, initializeFirebase } from './utils/firebase';
import { initializeNotifications, initializeResizeHandler } from './utils/functions';

console.log('----- KLEVCSOOCHAT ------');

initializeFirebase();
initializeNotifications();
initializeResizeHandler();
initializeCache();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
