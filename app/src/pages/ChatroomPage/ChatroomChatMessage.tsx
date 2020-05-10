import React from 'react';
import './ChatroomPage.css';
import { ChatMessage } from '../../utils/interfaces';
import { getUID } from '../../utils/firebase';

const ChatroomChatMessage = (props: ChatMessage) => {
  const outgoing = props.author.id === getUID();
  const authorName = !!props.author.name ? props.author.name : props.author.id;

  return (
    <div className={`chatroompage-chatmessage ${outgoing ? 'outgoing' : 'incoming'}`}>
      <h2>{authorName}</h2>
      <div>
        <div></div>
        {props.type === 'text' ? <p>{props.content}</p> : (
          <img src={props.content} alt={`Küldte: ${authorName}`} onLoad={() => {
            window.scrollTo(0, document.body.scrollHeight);
          }} />
        )}
      </div>
    </div>
  );
};

export default ChatroomChatMessage;
