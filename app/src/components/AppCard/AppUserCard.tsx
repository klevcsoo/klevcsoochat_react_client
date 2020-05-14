import React from 'react';
import AppCard from './AppCard';
import { useOtherUserInfo } from '../../utils/firebase';
import LoadingSpinner from '../LoadingSpinner';
import { getOnlineStatusText } from '../../utils/functions';

const AppUserCard = (props: { uid: string; }) => {
  const [ user, userLoading ] = useOtherUserInfo(props.uid);

  return !userLoading && !user ? null : (
    <AppCard>
      {userLoading ? <LoadingSpinner /> : !user ? null : (
        <div className="app-user-card">
          <img src={user.photo} alt={user.username} className={user.online ? 'online' : 'offline'} />
          <h2 className="app-small-header">{user.username ? user.username : user.email}</h2>
          <h3>{getOnlineStatusText(user.online, user.lastOnline)}</h3>
        </div>
      )}
    </AppCard>
  );
};

export default AppUserCard;
