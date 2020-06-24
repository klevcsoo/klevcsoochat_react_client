import React, { useState, useEffect } from 'react';
import './ChatroomSettingsPage.css';
import { useRouteMatch } from 'react-router-dom';
import { useChatroomMetadata, onChatroomMember, onChatroomRequest, leaveChatroom, updateChatroomMetadata } from '../../utils/firebase';
import LoadingOverlay from '../../components/LoadingOverlay';
import AppPageHeader from '../../components/AppPageHeader/AppPageHeader';
import AppCard from '../../components/AppCard/AppCard';
import AppInput from '../../components/AppInput/AppInput';
import AppButton from '../../components/AppButton/AppButton';
import AppUserCard from '../../components/AppCard/AppUserCard';
import AppRequestCard from '../../components/AppCard/AppRequestCard';
import { useAppNotification } from '../../components/AppNotification/AppNotifiaction';

const ChatroomSettingsPage = () => {
  const roomId = (useRouteMatch().params as any).id;
  const [ metadata, metadataLoading ] = useChatroomMetadata(roomId);
  const [ ChatroomUpdateError, showError ] = useAppNotification({
    type: 'error', persistent: false
  });
  const [ ChatroomUpdateSuccess, showSuccess ] = useAppNotification({
    type: 'info', persistent: false
  });

  const [ members, setMembers ] = useState<string[]>([]);
  const [ requests, setRequests ] = useState<string[] | null>([]);
  const [ roomPhoto, setRoomPhoto ] = useState('');
  const [ roomName, setRoomName ] = useState('');
  const [ updatingData, setUpdatingData ] = useState(false);

  useEffect(() => {
    if (!!metadata?.name) setRoomName(metadata.name);
    if (!!metadata?.photo) setRoomPhoto(metadata.photo);
  }, [ metadata ]);

  useEffect(() => {
    const membersCleanUp = onChatroomMember(roomId, ((uids) => setMembers(uids)));
    const requestsCleanUp = onChatroomRequest(roomId, ((uids) => setRequests(uids)));
    return () => { membersCleanUp(); requestsCleanUp(); };
  }, [ roomId ]);

  return metadataLoading ? <LoadingOverlay /> : !metadata ? null : (
    <div className="chatroomsettingspage-container">
      <ChatroomUpdateError />
      <ChatroomUpdateSuccess />
      <AppPageHeader title="Szoba beállításai" previous={ { icon: 'chat' } } />
      <p style={ { fontWeight: 300 } }>
        <b>Szoba azonosítója:</b> { roomId } <br />
        { !metadata.code ? null : (
          <React.Fragment><b>Szoba kód:</b> { metadata.code }</React.Fragment>
        ) }
      </p>
      <div className="chatroomsettingspage-list">
        <h2 className="app-small-header">Tagok:</h2>
        { members.map((m, i) => <AppUserCard uid={ m } key={ i } reducedMargin />) }
      </div>
      { !requests ? null : (
        <div className="chatroomsettingspage-list">
          <h2 className="app-small-header">Csatlakozási kérelmek:</h2>
          { requests.map((r, i) => <AppRequestCard uid={ r } rid={ roomId } reducedMargin key={ i } />) }
        </div>
      ) }
      <AppCard>
        <div className="chatroom-img-container">
          <img src={ roomPhoto } alt={ roomName } />
        </div>
        <AppInput placeholder="Szoba kép link" text={ roomPhoto } onTextChanged={ (text) => setRoomPhoto(text) } />
        <AppInput placeholder="Szoba neve" text={ roomName } onTextChanged={ (text) => setRoomName(text) } />
        <AppButton text="Adatok módosítása" type="primary" onClick={ () => {
          setUpdatingData(true); updateChatroomMetadata(roomId, { photo: roomPhoto, name: roomName }).then(() => {
            setUpdatingData(false); showSuccess('Adatok frissítve');
          }).catch((err) => {
            setUpdatingData(false); showError('Hiba történt frissítéskor');
            console.error(err);
          });
        } } loading={ updatingData } />
      </AppCard>
      <AppCard>
        <AppButton text="Szoba elhagyása" type="warning" onClick={ () => {
          leaveChatroom(roomId);
        } } />
        <p className="description">
          Később visszaléphetsz, ha elfogadják a kérelmed.
        </p>
        <AppButton text="Üzenetek törlése" type="warning" onClick={ () => { } } />
        <p className="description">
          A szobába írt összes üzenetet törli, a chat teljesen üres lesz,
          <span>az üzenetek örökre törlődnek.</span>
          Ez visszafordíthatatlan.
        </p>
        <AppButton text="Szoba törlése" type="warning" onClick={ () => { } } />
        <p className="description">
          Az egész <span>szoba véglegesen törölve lesz</span>
          beállításokkal együtt, így az eltűnik
          mindenkinek a listájából. Ez visszafordíthatatlan.
        </p>
      </AppCard>
    </div>
  );
};

export default ChatroomSettingsPage;
