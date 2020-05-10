import React, { useState } from 'react';
import './CreateChatroomPage.css';
import AppPageHeader from '../../components/AppPageHeader/AppPageHeader';
import AppCard from '../../components/AppCard/AppCard';
import AppInput from '../../components/AppInput/AppInput';
import CreateChatroomInviteesList from './CreateChatroomInviteesList';
import AppBottomAttachedButton from '../../components/AppButton/AppBottomAttachedButton';
import { createChatroom } from '../../utils/firebase';
import { useAppNotification } from '../../components/AppNotification/AppNotifiaction';
import { useHistory } from 'react-router-dom';
import { routes } from '../../utils/constants';

const CreateChatroomPage = () => {
  const [ CreateFailedNotification, showNotification ] = useAppNotification({
    persistent: false,
    type: 'error',
    text: 'A megadott adatok érvénytelenek'
  });
  const history = useHistory();

  const [ name, setName ] = useState('');
  const [ inviteCode, setInviteCode ] = useState('');
  const [ allInvitees, setAllInvitees ] = useState<string[]>([]);
  const [ creating, setCreating ] = useState(false);

  return (
    <div className="createchatroompage-container">
      <CreateFailedNotification />
      <AppPageHeader title="Szoba létrehozása" previous={{ icon: 'home' }} />
      <AppCard>
        <AppInput placeholder="Szoba neve" text={name} onTextChanged={(text) => setName(text)} />
        <p className="description">
          A szoba neve. Később módosítható.
        </p>
      </AppCard>
      <AppCard>
        <AppInput placeholder="Egyéni meghívó" text={inviteCode} onTextChanged={(text) => setInviteCode(text)} />
        <p className="description">
          <span>Nem kötelező megadni.</span><br />
          Ezzel az meghívóval is lehet csatlakozni
          a szobához az alap azonosító mellett.
          Minimum 5, maximum 12 karaktert tartalmazhat, amik
          számok, illetve az angol ABC betűi lehetnek (0-9;a-z).
        </p>
      </AppCard>
      <CreateChatroomInviteesList onListChanged={(list) => setAllInvitees(list)} />
      <p style={{ maxWidth: 300, margin: '0 auto' }}>
        Amint az összes résztvevő elhagyta a szobát az üzenetek törlődnek.
        A szoba ugyanúgy elérhető lesz, csak az üzenetek törlődnek.
      </p>
      <AppBottomAttachedButton text="Létrehozás" onClick={() => {
        setCreating(true);
        createChatroom({
          name: name,
          inviteCode: inviteCode,
          invitees: allInvitees
        }, (id) => {
          history.push(routes.CHATROOM.replace(':id', id));
        }, (err) => {
          setCreating(false);
          console.error(err); showNotification();
        });
      }} loading={creating} />
    </div>
  );
};

export default CreateChatroomPage;
