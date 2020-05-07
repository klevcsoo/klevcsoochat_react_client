import React from 'react';
import './AppInput.css';

const AppInput = (props: {
  placeholder: string,
  text: string,
  password: boolean;
  onTextChanged: (text: string) => void;
}) => {
  return (
    <input type={props.password ? 'password' : 'text'} className="app-input" placeholder={props.placeholder}
      value={props.text} onChange={(event) => {
        props.onTextChanged(event.target.value);
      }} />
  );
};

export default AppInput;
