import React, { useState, useEffect } from 'react';
import './ChatroomPage.css';
import { ChatMessage } from '../../utils/interfaces';
import { onNewMessage } from '../../utils/firebase';
import ChatroomChatMessage from './ChatroomChatMessage';
import { scrollToLatestMessage } from '../../utils/functions';

const ChatroomMessageList = (props: { roomId: string; }) => {
  const [ messageList, setMessageList ] = useState<ChatMessage[]>([]);

  useEffect(() => scrollToLatestMessage(), []);

  useEffect(() => {
    const cleanup = onNewMessage(props.roomId, (message) => {
      setMessageList((prevState) => [ ...prevState, message ]);
      setTimeout(() => scrollToLatestMessage(), 50);
    });
    return cleanup;
  }, [ props.roomId ]);

  return (
    <div className="chatroompage-messagelist" id="msglist">
      { messageList.map((m, i) => (
        <ChatroomChatMessage { ...m } key={ i } />
      )) }
    </div>
  );
};

export default ChatroomMessageList;
