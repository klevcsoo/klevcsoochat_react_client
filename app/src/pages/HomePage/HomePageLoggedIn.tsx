import React, { useState, useEffect } from 'react';
import AppCard from '../../components/AppCard/AppCard';
import AppButton from '../../components/AppButton/AppButton';
import { useHistory } from 'react-router-dom';
import { routes, regex } from '../../utils/constants';
import { logout, getRoomID, getUID, onUserRequests, onUserChatrooms } from '../../utils/firebase';
import AppInput from '../../components/AppInput/AppInput';
import AppUserCard from '../../components/AppCard/AppUserCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import AppChatroomCard from '../../components/AppCard/AppChatroomCard';

const HomePageLoggedIn = () => {
  const history = useHistory();
  const [ currentRoomId, setCurrentRoomId ] = useState('');
  const [ requests, setRequests ] = useState<(string | null)[]>([]);
  const [ chatrooms, setChatrooms ] = useState<(string | null)[]>([]);

  const requestChatroomAccess = () => {
    if (currentRoomId.length !== 0 && !currentRoomId.match(regex.WHITESPACE)) {
      if (currentRoomId[ 0 ] === '-') history.push(routes.CHATROOM.replace(':id', currentRoomId));
      else getRoomID(currentRoomId).then((id) => history.push(routes.CHATROOM.replace(':id', id)));
    } else history.push(routes.CREATE_CHATROOM);
  };

  useEffect(() => {
    const requestsCleanup = onUserRequests((ids) => setRequests(ids));
    const chatroomsCleanup = onUserChatrooms((ids) => setChatrooms(ids));
    return () => { requestsCleanup(); chatroomsCleanup(); };
  }, []);

  return (
    <div className="homepage-logged-in-content">
      <div style={{ height: 30 }}></div>
      <AppUserCard uid={getUID()} reducedMargin />
      <AppButton text="Kijelentkezés" type="warning" onClick={() => { logout(); }} />
      <AppButton text="Beállítások" type="secondary" onClick={() => {
        history.push(routes.ACCOUNT_SETTINGS);
      }} loading={false} />
      <AppCard>
        <AppInput placeholder="Szoba azonosító / meghívó" text={currentRoomId} onTextChanged={(text) => {
          setCurrentRoomId(text);
        }} onSubmit={() => requestChatroomAccess()} />
        <AppButton text={currentRoomId.length > 0 ? 'Csatlakozási kérelem küldése' : 'Szoba létrehozása'}
          onClick={() => requestChatroomAccess()} type="primary" />
      </AppCard>
      <div style={{ margin: 30 }}>
        {requests.length !== 0 && requests.some((val) => !val) ? null : requests.length === 0 ? <LoadingSpinner /> : (
          <React.Fragment>
            <h2 className="app-small-header" style={{
              marginBottom: 15
            }}>Belépési kérelmek:</h2>
            {requests.map((room, i) => {
              if (!room) return null;
              else return <AppChatroomCard id={room} key={i} reducedMargin />;
            })}
          </React.Fragment>
        )}
      </div>
      <div style={{ margin: 30 }}>
        {chatrooms.length !== 0 && chatrooms.some((val) => !val) ? null : chatrooms.length === 0 ? <LoadingSpinner /> : (
          <React.Fragment>
            <h2 className="app-small-header" style={{
              marginBottom: 15
            }}>Saját szobák:</h2>
            {chatrooms.map((room, i) => {
              if (!room) return null;
              else return <AppChatroomCard id={room} key={i} reducedMargin />;
            })}
          </React.Fragment>
        )}
      </div>
      <div style={{ height: 50 }}></div>
    </div>
  );
};

export default HomePageLoggedIn;
