import React from 'react'
import './AppSwitch.css'

const AppSwitch = ({ isEnabled, setIsEnabled, text }) => {
  return (
    <div className="app-switch">
      <p>{text}</p>
      <label className="app-switch-label">
        <input type="checkbox" onChange={(e) => setIsEnabled()}
        className="app-switch-input" id="closed-class-switch" checked={isEnabled} />
        <span className="app-switch-span noshadow"></span>
      </label>
    </div>
  )
}

export default AppSwitch
