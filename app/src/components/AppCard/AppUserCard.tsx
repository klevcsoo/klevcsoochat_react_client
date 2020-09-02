import React from 'react';
import './AppCard.css';
import { useUserInfoUI } from '../../utils/firebase';
import LoadingSpinner from '../LoadingSpinner';
import { getOnlineStatusText } from '../../utils/functions';
import { defaultAccountPhoto } from '../../utils/constants';

const AppUserCard = (props: { uid: string, reducedMargin?: boolean; }) => {
  const [ user, userLoading ] = useUserInfoUI(props.uid);

  return !userLoading && !user ? null : (
    <div className="app-card" style={ {
      margin: `${ props.reducedMargin ? '10' : '30' }px auto`
    } }>
      { userLoading ? <LoadingSpinner /> : !user ? null : (
        <div className="app-user-card">
          <img src={ user.photo } alt={ user.username } onError={ (event) => {
            event.currentTarget.src = defaultAccountPhoto;
          } } className={ user.online ? 'online' : 'offline' } />
          <h2 className="app-small-header">{ user.username }</h2>
          <h3>{ getOnlineStatusText(user.online, user.lastOnline) }</h3>
        </div>
      ) }
    </div>
  );
};

export default AppUserCard;
