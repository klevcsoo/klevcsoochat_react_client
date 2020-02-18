import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { firebaseHandler } from './Utils'

ReactDOM.render(<App />, document.getElementById('root'))
firebaseHandler.initializeApp()
