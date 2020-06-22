import React from 'react';
import { CloseRounded } from '@material-ui/icons';

const CreateChatroomInvitee = (props: {
  email: string,
  onDiscard: () => void;
}) => {
  return (
    <div className="createchatroompage-invitee">
      <p>{ props.email }</p>
      <div onClick={ () => props.onDiscard() }>
        <CloseRounded color="inherit" />
      </div>
    </div>
  );
};

export default CreateChatroomInvitee;
