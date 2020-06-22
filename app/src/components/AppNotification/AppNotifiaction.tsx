import React, { useState } from 'react';
import './AppNotifiaction.css';
import { AppNotificatonData } from '../../utils/interfaces';
import AppCard from '../AppCard/AppCard';
import AppButton from '../AppButton/AppButton';

const AppNotifiaction = (props: {
  text: string,
  type: 'info' | 'error',
  visible: boolean,
  persistent: boolean,
  onDismiss: () => void,
  anim: boolean;
}) => {
  return (
    <div className={ `app-notification${props.visible ? ' visible' : ''}${props.anim ? ' anim' : ''} ${props.type}` }>
      <AppCard>
        <h2 className="app-small-header">{ props.text }</h2>
        { !props.persistent ? null : (
          <AppButton text="OK" type='primary' onClick={ () => props.onDismiss() } />
        ) }
      </AppCard>
    </div>
  );
};

export function useAppNotification(props: AppNotificatonData): [ () => (JSX.Element), (text: string) => void ] {
  const [ visible, setVisible ] = useState(false);
  const [ render, setRender ] = useState(false);
  const [ text, setText ] = useState("");
  const [ anim, setAnim ] = useState(true);

  const notification = () => (
    <React.Fragment>
      { !render ? null : (
        <AppNotifiaction text={ text } type={ props.type } visible={ visible } onDismiss={ () => {
          hide(); if (!!props.onDismiss) props.onDismiss();
        } } persistent={ props.persistent } anim={ anim } />
      ) }
    </React.Fragment>
  );

  const show = (text: string) => {
    setText(text); setAnim(true); setRender(true); setVisible(true);
    setTimeout(() => setAnim(false), 600);
    if (!props.persistent && !visible) setTimeout(() => hide(), 4000);
  };
  const hide = () => {
    setAnim(true); setVisible(false);
    setTimeout(() => { setRender(false); setText(""); }, 500);
  };

  return [ notification, show ];
}

export default AppNotifiaction;
