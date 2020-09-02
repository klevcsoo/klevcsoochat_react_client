import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { initializeFirebase } from './utils/firebase';
import { initializeNotifications, initializeResizeHandler } from './utils/functions';

console.log('----- KLEVCSOOCHAT ------');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

initializeFirebase();
initializeNotifications();
initializeResizeHandler();
