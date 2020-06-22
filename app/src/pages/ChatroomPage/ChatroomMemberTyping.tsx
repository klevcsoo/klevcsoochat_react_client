import React from 'react';
import './ChatroomPage.css';
import { useUserInfoUI, getUID } from '../../utils/firebase';

const ChatroomMemberTyping = (props: { uid: string; }) => {
  const [ user, userloading ] = useUserInfoUI(props.uid);

  return userloading || !user || props.uid === getUID() ? null : (
    <div className="chatroompage-member-typing">
      <img src={ user.photo } onLoad={ () => {
        window.scrollTo(0, document.body.scrollHeight);
      } } alt={ user.username } />
      <p><b>{ user.username }</b> éppen ír...</p>
    </div>
  );
};

export default ChatroomMemberTyping;
