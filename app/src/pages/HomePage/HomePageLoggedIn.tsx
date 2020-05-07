import React, { useState, useEffect } from 'react';
import { User } from 'firebase';
import AppCard from '../../components/AppCard/AppCard';
import AppButton from '../../components/AppButton/AppButton';
import { useHistory } from 'react-router-dom';
import { routes } from '../../utils/constants';
import { ChatroomMetadata } from '../../utils/interfaces';
import { getSavedChatrooms, logout } from '../../utils/firebase';
import LoadingSpinner from '../../components/LoadingSpinner';
import AppInput from '../../components/AppInput/AppInput';

const HomePageLoggedIn = (props: {
  user: User;
}) => {
  const history = useHistory();
  const [ savedRooms, setSavedRooms ] = useState<ChatroomMetadata[] | null>(null);
  const [ currentRoomId, setCurrentRoomId ] = useState('');

  useEffect(() => {
    getSavedChatrooms((r) => setSavedRooms(r));
  }, []);

  return (
    <div className="homepage-logged-in-content">
      <AppCard className="account-link-container">
        <h1>{props.user.displayName}</h1>
        <h2>{props.user.email}</h2>
        <AppButton text="Beállítások" type="secondary" onClick={() => {
          history.push(routes.ACCOUNT_SETTINGS);
        }} loading={false} />
      </AppCard>
      <AppCard>
        <h2 className="app-small-header">Lementett szobák</h2>
        <div style={{ height: 10 }}></div>
        {!savedRooms ? <LoadingSpinner /> : (
          <div style={{ marginTop: 5 }}>
            {savedRooms.map((r) => (
              <span className="saved-chatroom-name" onClick={() => {
                history.push(routes.HOME.concat(`chatroom/${r.id}`));
              }} key={r.id}>{r.name}<br /></span>
            ))}
          </div>
        )}
      </AppCard>
      <AppCard>
        <AppInput placeholder="Szoba azonosító / meghívó" text={currentRoomId} onTextChanged={(text) => {
          setCurrentRoomId(text);
        }} />
        <AppButton text={currentRoomId.length > 0 ? 'Csatlakozás a szobához' : 'Szoba létrehozása'} onClick={() => {
          if (currentRoomId.length > 0) history.push(routes.HOME.concat(`chatroom/${currentRoomId}`));
          else history.push(routes.CREATE_CHATROOM);
        }} type="primary" />
      </AppCard>
      <AppButton text="Kijelentkezés" type="warning" onClick={() => { logout(); }} />
      <div style={{ height: 50 }}></div>
    </div>
  );
};

export default HomePageLoggedIn;
