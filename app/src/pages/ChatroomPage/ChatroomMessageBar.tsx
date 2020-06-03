import React, { useState, useEffect } from 'react';
import './ChatroomPage.css';
import { SendRounded, InsertPhotoRounded } from '@material-ui/icons';
import AppInput from '../../components/AppInput/AppInput';
import { sendChatMessage, setTypingStatus, onMemberTyping } from '../../utils/firebase';
import ChatroomMemberTyping from './ChatroomMemberTyping';

const typingTimer: [ any ] = [ null ];

const ChatroomMessageBar = (props: { roomId: string; }) => {
  const [ message, setMessage ] = useState('');
  const [ urlMode, setUrlMode ] = useState(false);
  const [ membersTyping, setMembersTyping ] = useState<string[]>([]);

  const sendMessage = () => {
    sendChatMessage({
      type: urlMode ? 'image' : 'text',
      content: message
    }, props.roomId).catch((err) => console.error(err));
    setMessage(''); setUrlMode(false); setTypingStatus(false, props.roomId);
  };

  const sendTyping = () => {
    clearTimeout(typingTimer[ 0 ] as number);
    setTypingStatus(true, props.roomId);
    typingTimer[ 0 ] = setTimeout(() => setTypingStatus(false, props.roomId), 3000);
  };

  useEffect(() => {
    const cleanup = onMemberTyping(props.roomId, (uids) => setMembersTyping(uids));
    return cleanup;
  }, [ props.roomId ]);

  return (
    <React.Fragment>
      <div className="chatroompage-typing-indicators">
        {membersTyping.map((m, i) => <ChatroomMemberTyping uid={m} key={i} />)}
      </div>
      <div style={{ height: 100 }}></div>
      <div className="chatroompage-messagebar acrylic-transparent">
        <div className={`messagebar-button toggle ${urlMode ? 'on' : 'off'}`} onClick={() => setUrlMode(!urlMode)}>
          <InsertPhotoRounded color="inherit" />
        </div>
        <form action="" method="post" autoComplete="off">
          <AppInput placeholder={urlMode ? 'Kép link' : 'Aa'} text={message}
            onTextChanged={(text) => {
              setMessage(text); sendTyping();
            }} onSubmit={() => sendMessage()} />
        </form>
        <div className="messagebar-button click" onClick={() => sendMessage()}>
          <SendRounded color="inherit" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ChatroomMessageBar;
