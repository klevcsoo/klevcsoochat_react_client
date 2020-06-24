import React, { useState } from 'react';
import './AppCard.css';
import { useUserInfoUI, respondToRequest } from '../../utils/firebase';
import LoadingSpinner from '../LoadingSpinner';
import { getOnlineStatusText } from '../../utils/functions';
import AppButton from '../AppButton/AppButton';
import { defaultAccountPhoto } from '../../utils/constants';

const AppRequestCard = (props: { uid: string, rid: string, reducedMargin?: boolean; }) => {
  const [ user, userLoading ] = useUserInfoUI(props.uid);
  const [ responding, setResponding ] = useState(false);

  return !userLoading && !user ? null : (
    <div className="app-card" style={ {
      margin: `${props.reducedMargin ? '10' : '30'}px auto`
    } }>
      { userLoading ? <LoadingSpinner /> : !user ? null : (
        <React.Fragment>
          <div className="app-user-card">
            <img src={ user.photo } alt={ user.username } onError={ (event) => {
              event.currentTarget.src = defaultAccountPhoto;
            } } className={ user.online ? 'online' : 'offline' } />
            <h2 className="app-small-header">{ user.username ? user.username : user.email }</h2>
            <h3>{ getOnlineStatusText(user.online, user.lastOnline) }</h3>
          </div>
          <AppButton text="Elfogadás" type="secondary" onClick={ () => {
            setResponding(true);
            respondToRequest(true, props.uid, props.rid).then(() => setResponding(false));
          } } loading={ responding } />
          <AppButton text="Elutasítás" type="warning" onClick={ () => {
            setResponding(true);
            respondToRequest(false, props.uid, props.rid).then(() => setResponding(false));
          } } loading={ responding } />
        </React.Fragment>
      ) }
    </div>
  );
};

export default AppRequestCard;
