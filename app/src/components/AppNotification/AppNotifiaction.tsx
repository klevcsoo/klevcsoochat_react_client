import React, { useState } from 'react';
import './AppNotifiaction.css';
import { AppNotificatonData } from '../../utils/interfaces';
import AppCard from '../AppCard/AppCard';
import AppButton from '../AppButton/AppButton';

const AppNotifiaction = (props: {
  text: string,
  type: 'info' | 'error',
  visible: boolean,
  persistent: boolean;
  onDismiss: () => void;
}) => {
  return (
    <div className={`app-notification${props.visible ? ' visible' : ''}`}>
      <AppCard>
        <h2 className="app-small-header">{props.text}</h2>
        {!props.persistent ? null : (
          <AppButton text="OK" type='primary' onClick={() => props.onDismiss()} />
        )}
      </AppCard>
    </div>
  );
};

export function useAppNotification(props: AppNotificatonData): [ () => (JSX.Element), () => void ] {
  const [ visible, setVisible ] = useState(false);
  const [ render, setRender ] = useState(false);

  const notification = () => (
    <React.Fragment>
      {!render ? null : (
        <AppNotifiaction text={props.text} type={props.type} visible={visible} onDismiss={() => {
          hide(); if (!!props.onDismiss) props.onDismiss();
        }} persistent={props.persistent} />
      )}
    </React.Fragment>
  );

  const show = () => {
    setRender(true); setVisible(true);
    if (!props.persistent && !visible) setTimeout(() => hide(), 2000);
  };
  const hide = () => {
    setVisible(false); setTimeout(() => setRender(false), 500);
  };

  return [ notification, show ];
}

export default AppNotifiaction;
