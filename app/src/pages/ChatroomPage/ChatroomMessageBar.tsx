import React, { useState, useEffect } from 'react';
import './ChatroomPage.css';
import { SendRounded, InsertPhotoRounded, LinkRounded } from '@material-ui/icons';
import AppInput from '../../components/AppInput/AppInput';
import { sendChatMessage, setTypingStatus, onMemberTyping, uploadChatImage } from '../../utils/firebase';
import ChatroomMemberTyping from './ChatroomMemberTyping';
import { useAppNotification } from '../../components/AppNotification/AppNotifiaction';
import LoadingOverlay from '../../components/LoadingOverlay';

const typingTimer: [ any ] = [ null ];

const ChatroomMessageBar = (props: { roomId: string; }) => {
  const [ UploadErrorNotification, showUploadError ] = useAppNotification({
    persistent: false,
    type: 'error'
  });
  const [ message, setMessage ] = useState('');
  const [ urlMode, setUrlMode ] = useState(false);
  const [ membersTyping, setMembersTyping ] = useState<string[]>([]);
  const [ uploadingImage, setUploadingImage ] = useState(false);

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

  const uploadPhoto = () => {
    const fileUpload = document.createElement('input');
    fileUpload.type = 'file'; fileUpload.style.display = 'none';

    function onFile(this: any) {
      const photo = this.files[ 0 ] as File;
      if (!photo.type.startsWith('image/')) showUploadError('Helytelen fájltípus');

      setUploadingImage(true);
      uploadChatImage(photo).then((url) => {
        sendChatMessage({ type: 'image', content: url }, props.roomId);
        setUploadingImage(false);
      }).catch((err) => {
        console.error(err); showUploadError('Hiba történt a feltöltés során');
        setUploadingImage(false);
      });
    }

    fileUpload.addEventListener('change', onFile);
    document.body.appendChild(fileUpload);
    fileUpload.click();
  };

  useEffect(() => {
    const cleanup = onMemberTyping(props.roomId, (uids) => setMembersTyping(uids));
    return cleanup;
  }, [ props.roomId ]);

  return (
    <React.Fragment>
      { uploadingImage ? <LoadingOverlay /> : null }
      <UploadErrorNotification />
      <div className="chatroompage-typing-indicators">
        { membersTyping.map((m, i) => <ChatroomMemberTyping uid={ m } key={ i } />) }
      </div>
      <div style={ { height: 100 } }></div>
      <div className="chatroompage-messagebar acrylic-transparent">
        <div className="messagebar-button click" onClick={ () => uploadPhoto() }>
          <InsertPhotoRounded color="inherit" />
        </div>
        <div className={ `messagebar-button toggle ${urlMode ? 'on' : 'off'}` } onClick={ () => setUrlMode(!urlMode) }>
          <LinkRounded color="inherit" />
        </div>
        <form action="" method="post" autoComplete="off">
          <AppInput placeholder={ urlMode ? 'Kép link' : 'Aa' } text={ message }
            onTextChanged={ (text) => {
              setMessage(text); sendTyping();
            } } onSubmit={ () => sendMessage() } />
        </form>
        <div className="messagebar-button click" onClick={ () => sendMessage() }>
          <SendRounded color="inherit" />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ChatroomMessageBar;
