import React, { useState } from 'react';
import './ChatroomPage.css';
import { SendRounded, InsertPhotoRounded } from '@material-ui/icons';
import AppInput from '../../components/AppInput/AppInput';
import { sendChatMessage } from '../../utils/firebase';

const ChatroomMessageBar = (props: {
  roomId: string;
}) => {
  const [ message, setMessage ] = useState('');
  const [ urlMode, setUrlMode ] = useState(false);

  const sendMessage = () => {
    sendChatMessage({
      type: urlMode ? 'image' : 'text',
      content: message
    }, props.roomId).catch((err) => console.error(err));
    setMessage(''); setUrlMode(false);
  };

  return (
    <React.Fragment>
      <div className="chatroompage-messagebar">
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
      <div style={{ height: 100 }}></div>
    </React.Fragment>
  );
};

export default ChatroomMessageBar;
