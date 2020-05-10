import React, { useState, useEffect } from 'react';
import { User } from 'firebase';
import AppCard from '../../components/AppCard/AppCard';
import AppButton from '../../components/AppButton/AppButton';
import { useHistory } from 'react-router-dom';
import { routes, regex } from '../../utils/constants';
import { ChatroomMetadata } from '../../utils/interfaces';
import { getSavedChatrooms, logout, getRoomID } from '../../utils/firebase';
import LoadingSpinner from '../../components/LoadingSpinner';
import AppInput from '../../components/AppInput/AppInput';

const HomePageLoggedIn = (props: {
  user: User;
}) => {
  const history = useHistory();
  const [ savedRooms, setSavedRooms ] = useState<(ChatroomMetadata | null)[] | null>(null);
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
      {!savedRooms || (!!savedRooms && savedRooms.some((val) => val !== null)) ? (
        <AppCard>
          <h2 className="app-small-header">Lementett szobák</h2>
          <div style={{ height: 10 }}></div>
          {!savedRooms ? <LoadingSpinner /> : (
            <div style={{ marginTop: 5 }}>
              {savedRooms.map((r) => (
                <span className="saved-chatroom-name" onClick={() => {
                  if (!r) return;
                  history.push(routes.CHATROOM.replace(':id', r.id));
                }} key={r?.id}>{r?.name}<br /></span>
              ))}
            </div>
          )}
        </AppCard>
      ) : null}
      <AppCard>
        <AppInput placeholder="Szoba azonosító / meghívó" text={currentRoomId} onTextChanged={(text) => {
          setCurrentRoomId(text);
        }} onSubmit={() => {
          if (currentRoomId.length !== 0 && !currentRoomId.match(regex.WHITESPACE)) {
            if (currentRoomId[ 0 ] === '-') history.push(routes.CHATROOM.replace(':id', currentRoomId));
            else getRoomID(currentRoomId, (id) => history.push(routes.CHATROOM.replace(':id', id)));
          }
        }} />
        <AppButton text={currentRoomId.length > 0 ? 'Csatlakozás a szobához' : 'Szoba létrehozása'} onClick={() => {
          if (currentRoomId.length !== 0 && !currentRoomId.match(regex.WHITESPACE)) {
            if (currentRoomId[ 0 ] === '-') history.push(routes.CHATROOM.replace(':id', currentRoomId));
            else getRoomID(currentRoomId, (id) => history.push(routes.CHATROOM.replace(':id', id)));
          }
        }} type="primary" />
      </AppCard>
      <AppButton text="Kijelentkezés" type="warning" onClick={() => { logout(); }} />
      <div style={{ height: 50 }}></div>
    </div>
  );
};

export default HomePageLoggedIn;
