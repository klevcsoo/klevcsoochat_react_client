import React from 'react';
import './AppInput.css';

const AppInput = (props: {
  placeholder: string,
  text: string,
  type?: 'text' | 'email' | 'password' | 'url' | 'tel',
  onTextChanged: (text: string) => void,
  onSubmit?: () => void;
}) => {
  return (
    <input type={ !!props.type ? props.type : 'text' } className="app-input" placeholder={ props.placeholder }
      value={ props.text } onChange={ (event) => {
        props.onTextChanged(event.target.value);
      } } onKeyDown={ (event) => {
        if (event.keyCode === 13 && !!props.onSubmit) {
          event.preventDefault(); props.onSubmit();
        }
      } } autoComplete={ !props.type || props.type === 'text' ? 'off' : props.type === 'password' ? 'current-password' : 'on' } />
  );
};

export default AppInput;
