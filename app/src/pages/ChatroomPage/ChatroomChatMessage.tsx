import React, { useState, useEffect } from 'react';
import './ChatroomPage.css';
import { ChatMessage } from '../../utils/interfaces';
import { getUID } from '../../utils/firebase';
import { formatChatSentDate } from '../../utils/functions';

const ChatroomChatMessage = (props: ChatMessage) => {
  const [ imageOpened, setImageOpened ] = useState(false);

  useEffect(() => {
    if (imageOpened) document.body.style.overflowY = 'hidden';
    else document.body.style.overflowY = 'scroll';
  }, [ imageOpened ]);

  const outgoing = props.author.id === getUID();
  const authorName = !!props.author.name ? props.author.name : props.author.id;

  return (
    <React.Fragment>
      <div className={ `chatroompage-chatmessage ${outgoing ? 'outgoing' : 'incoming'}` }>
        { !outgoing ? <h2>{ authorName } <span>{ formatChatSentDate(props.sent) }</span></h2> : null }
        <div>
          { props.type === 'text' ? <p>{ props.content }</p> : (
            <img src={ props.content } alt={ `Küldte: ${authorName}` } onLoad={ () => {
              window.scrollTo(0, document.body.scrollHeight);
            } } onClick={ () => setImageOpened(true) } />
          ) }
        </div>
      </div>
      { props.type !== 'image' ? null : (
        <div className={ `chatroompage-chatmessage-openedimage${imageOpened ? ' opened acrylic-transparent' : ''}` }
          onClick={ () => setImageOpened(false) }>
          <img src={ props.content } alt={ `Küldte: ${authorName}` } onLoad={ () => {
            window.scrollTo(0, document.body.scrollHeight);
          } } />
        </div>
      ) }
    </React.Fragment>
  );
};

export default ChatroomChatMessage;
