import React, { useState, useEffect } from 'react';
import './ChatroomSettingsPage.css';
import { useRouteMatch } from 'react-router-dom';
import { useChatroomMetadata } from '../../utils/firebase';
import LoadingOverlay from '../../components/LoadingOverlay';
import AppPageHeader from '../../components/AppPageHeader/AppPageHeader';
import AppCard from '../../components/AppCard/AppCard';
import AppInput from '../../components/AppInput/AppInput';
import AppButton from '../../components/AppButton/AppButton';

const ChatroomSettingsPage = () => {
  const roomId = (useRouteMatch().params as any).id;
  const [ metadata, metadataLoading ] = useChatroomMetadata(roomId);

  const [ roomName, setRoomName ] = useState('');
  const [ updatingName, setUpdatingName ] = useState(false);

  useEffect(() => {
    if (!!metadata?.name) setRoomName(metadata.name);
  }, [ metadata ]);

  return metadataLoading ? <LoadingOverlay /> : !metadata ? null : (
    <div className="chatroomsettingspage-container">
      <AppPageHeader title="Szoba beállításai" previous={{ icon: 'chat' }} />
      <p style={{ fontWeight: 300 }}>
        <b>Szoba azonosítója:</b> {roomId} <br />
        <b>Szoba neve:</b> {metadata.name} <br />
        {!metadata.code ? null : (
          <React.Fragment><b>Meghívó kód:</b> {metadata.code}</React.Fragment>
        )}
      </p>
      <AppCard>
        <AppInput placeholder="Szoba neve" text={String(roomName)} onTextChanged={(text) => setRoomName(text)} />
        <AppButton text="Név módosítása" type="primary" onClick={() => {
          setUpdatingName(true);
        }} loading={updatingName} />
      </AppCard>
      <AppCard>
        <AppButton text="Üzenetek törlése" type="warning" onClick={() => { }} />
        <p className="description">
          A szobába írt összes üzenetet törli, a chat teljesen üres lesz,
          <span>az üzenetek örökre törlődnek.</span>
          Ez visszafordíthatatlan.
        </p>
        <AppButton text="Szoba törlése" type="warning" onClick={() => { }} />
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
