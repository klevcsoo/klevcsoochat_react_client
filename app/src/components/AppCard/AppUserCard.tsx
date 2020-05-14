import React from 'react';
import './AppCard.css';
import { useOtherUserInfo } from '../../utils/firebase';
import LoadingSpinner from '../LoadingSpinner';
import { getOnlineStatusText } from '../../utils/functions';

const AppUserCard = (props: { uid: string, reducedMargin?: boolean; }) => {
  const [ user, userLoading ] = useOtherUserInfo(props.uid);

  return !userLoading && !user ? null : (
    <div className="app-card" style={{
      margin: `${props.reducedMargin ? '10' : '30'}px auto`
    }}>
      {userLoading ? <LoadingSpinner /> : !user ? null : (
        <div className="app-user-card">
          <img src={user.photo} alt={user.username} className={user.online ? 'online' : 'offline'} />
          <h2 className="app-small-header">{user.username ? user.username : user.email}</h2>
          <h3>{getOnlineStatusText(user.online, user.lastOnline)}</h3>
        </div>
      )}
    </div>
  );
};

export default AppUserCard;
