import React from 'react';
import './ChatroomPage.css';
import { ChatMessage } from '../../utils/interfaces';
import { getUID } from '../../utils/firebase';

const ChatroomChatMessage = (props: ChatMessage) => {
  const outgoing = props.author.id === getUID();

  return (
    <div className={`chatroompage-chatmessage ${outgoing ? 'outgoing' : 'incoming'}`}>
      <h2>{outgoing ? 'Én' : !!props.author.name ? props.author.name : props.author.id}</h2>
    </div>
  );
};

export default ChatroomChatMessage;
