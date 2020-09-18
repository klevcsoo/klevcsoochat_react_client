import React, { useState, useEffect } from 'react';
import './ChatroomPage.css';
import { ChatMessage } from '../../utils/interfaces';
import { getUID } from '../../utils/firebase';
import { formatChatSentDate, scrollToLatestMessage } from '../../utils/functions';

const ChatroomChatMessage = (props: ChatMessage) => {
  const [ imageOpen, setImageOpen ] = useState(false);
  const [ reactionsOpen, setReactionsOpen ] = useState(false);
  const [ reactionsPos, setReactionsPos ] = useState<[ number, number ]>([ 0, 0 ]);

  useEffect(() => {
    if (imageOpen) document.body.style.overflowY = 'hidden';
    else document.body.style.overflowY = 'scroll';
  }, [ imageOpen ]);

  useEffect(() => {
    const handler = () => setReactionsOpen(false);
    if (reactionsOpen) document.documentElement.addEventListener('click', handler);
    else document.documentElement.removeEventListener('click', handler);
  }, [ reactionsOpen ]);

  const outgoing = props.author.id === getUID();
  const authorName = !!props.author.name ? props.author.name : props.author.id;

  return (
    <React.Fragment>
      <div className={ `chatroompage-chatmessage ${ outgoing ? 'outgoing' : 'incoming' }` }>
        { !outgoing ? <h2>{ authorName } <span>{ formatChatSentDate(props.sent) }</span></h2> : null }
        { !reactionsOpen ? null : (
          <span className="chatroompage-chatmessage-reactions" onClick={ () => {
            setTimeout(() => setReactionsOpen(false), 1500);
          } } style={ {
            top: `${ reactionsPos[ 1 ] }%`, left: `${ reactionsPos[ 0 ] }%`
          } }>
            <span role="img" aria-label="heart">❤️</span>
            <span role="img" aria-label="laugh">😂</span>
            <span role="img" aria-label="sad">😢</span>
            <span role="img" aria-label="suprised">😮</span>
            <span role="img" aria-label="like">👍</span>
          </span>
        ) }
        <div onContextMenu={ (event) => {
          event.preventDefault();
          setReactionsPos([
            (event.clientX / document.documentElement.clientWidth) * 100,
            (event.clientY / document.documentElement.clientHeight) * 100
          ]); setReactionsOpen(true);
        } }>
          { props.type === 'text' ? <p>{ props.content }</p> : (
            <img src={ props.content } alt={ `Küldte: ${ authorName }` } onLoad={ () => {
              scrollToLatestMessage();
            } } onClick={ () => setImageOpen(true) } />
          ) }
        </div>
      </div>
      { props.type !== 'image' ? null : (
        <div className={ `chatroompage-chatmessage-openedimage${ imageOpen ? ' opened acrylic-transparent' : '' }` }
          onClick={ () => setImageOpen(false) }>
          <img src={ props.content } alt={ `Küldte: ${ authorName }` } onLoad={ () => {
            scrollToLatestMessage();
          } } />
        </div>
      ) }
    </React.Fragment>
  );
};

export default ChatroomChatMessage;
