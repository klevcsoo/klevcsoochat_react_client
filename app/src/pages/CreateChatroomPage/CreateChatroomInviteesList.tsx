import React, { useState, useEffect } from 'react';
import AppCard from '../../components/AppCard/AppCard';
import AppInput from '../../components/AppInput/AppInput';
import CreateChatroomInvitee from './CreateChatroomInvitee';

const CreateChatroomInviteesList = (props: {
  onListChanged: (list: string[]) => void;
}) => {
  const [ currentInvitee, setCurrentInvitee ] = useState('');
  const [ allInvitees, setAllInvitees ] = useState<string[]>([]);

  const removeInvitee = (email: string) => {
    const a: string[] = [];
    allInvitees.forEach((o) => {
      if (email !== o) a.push(o);
    });

    setAllInvitees(a);
  };

  useEffect(() => {
    props.onListChanged(allInvitees);
  }, [ allInvitees, props ]);

  return (
    <AppCard>
      {allInvitees.map((email, index) => (
        <CreateChatroomInvitee email={email} onDiscard={() => removeInvitee(email)} key={index} />
      ))}
      <div style={{ height: 5 }}></div>
      <AppInput placeholder="E-mail" text={currentInvitee} onTextChanged={(text) => setCurrentInvitee(text)}
        onSubmit={() => {
          if (currentInvitee.match(/^\s+$/g) || !currentInvitee.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g)) return;
          setAllInvitees([ ...allInvitees, currentInvitee ]);
          setCurrentInvitee('');
        }} />
      <p className="description">
        <span>Nem kötelező megadni.</span><br />
        Ha már van ötleted, kit szeretnél a szobába meghívni,
        ide írd be az e-mailt-amivel regisztráltak.
      </p>
    </AppCard>
  );
};

export default CreateChatroomInviteesList;
