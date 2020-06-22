import React, { useState, useEffect } from 'react';
import './DashBoardPage.css';
import { useHistory } from 'react-router-dom';
import { regex, routes } from '../../utils/constants';
import { sendChatroomRequest, onUserRequests, onUserChatrooms, getUID, logout } from '../../utils/firebase';
import AppUserCard from '../../components/AppCard/AppUserCard';
import AppButton from '../../components/AppButton/AppButton';
import AppCard from '../../components/AppCard/AppCard';
import AppInput from '../../components/AppInput/AppInput';
import AppChatroomCard from '../../components/AppCard/AppChatroomCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ReactComponent as AppLogo } from '../../assets/app-logo.svg';

const DashBoardPage = () => {
  const history = useHistory();
  const [ currentRoomId, setCurrentRoomId ] = useState('');
  const [ requests, setRequests ] = useState<(string | null)[]>([]);
  const [ chatrooms, setChatrooms ] = useState<(string | null)[]>([]);
  const [ requesting, setRequesting ] = useState(false);

  const openChatroom = () => {
    if (currentRoomId.length !== 0 && !currentRoomId.match(regex.WHITESPACE)) {
      setRequesting(true);
      sendChatroomRequest(currentRoomId).then(() => setRequesting(false)).catch((err) => {
        console.error(err); setRequesting(false);
      });
      setCurrentRoomId('');
    } else history.push(routes.CREATE_CHATROOM);
  };

  useEffect(() => {
    const requestsCleanup = onUserRequests((ids) => setRequests(ids));
    const chatroomsCleanup = onUserChatrooms((ids) => setChatrooms(ids));
    return () => { requestsCleanup(); chatroomsCleanup(); };
  }, []);

  return (
    <React.Fragment>
      <img src={ require('../../assets/home-bg.jpg') } alt="background" className="dashboard-bg" />
      <div className="dashboard-container">
        <AppLogo />
        <div style={ { height: 30 } }></div>
        <AppUserCard uid={ getUID() } reducedMargin />
        <AppButton text="Kijelentkezés" type="warning" onClick={ () => { logout(); } } />
        <AppButton text="Beállítások" type="secondary" onClick={ () => {
          history.push(routes.ACCOUNT_SETTINGS);
        } } loading={ false } />
        <AppCard>
          <AppInput placeholder="Szoba azonosító / meghívó" text={ currentRoomId } onTextChanged={ (text) => {
            setCurrentRoomId(text);
          } } onSubmit={ () => openChatroom() } />
          <AppButton text={ currentRoomId.length > 0 ? 'Csatlakozási kérelem küldése' : 'Szoba létrehozása' }
            onClick={ () => openChatroom() } type="primary" loading={ requesting } />
        </AppCard>
        <div style={ { margin: 30 } }>
          { requests.length !== 0 && requests.some((val) => !val) ? null : requests.length === 0 ? <LoadingSpinner /> : (
            <React.Fragment>
              <h2 className="app-small-header" style={ {
                marginBottom: 15
              } }>Belépési kérelmek:</h2>
              { requests.map((room, i) => {
                if (!room) return null;
                else return <AppChatroomCard id={ room } key={ i } reducedMargin request />;
              }) }
            </React.Fragment>
          ) }
        </div>
        <div style={ { margin: 30 } }>
          { chatrooms.length !== 0 && chatrooms.some((val) => !val) ? null : chatrooms.length === 0 ? <LoadingSpinner /> : (
            <React.Fragment>
              <h2 className="app-small-header" style={ {
                marginBottom: 15
              } }>Saját szobák:</h2>
              { chatrooms.map((room, i) => {
                if (!room) return null;
                else return <AppChatroomCard id={ room } key={ i } reducedMargin />;
              }) }
            </React.Fragment>
          ) }
        </div>
        <div style={ { height: 50 } }></div>
      </div>
    </React.Fragment>
  );
};

export default DashBoardPage;
