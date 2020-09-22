import React, { useState, useEffect } from 'react';
import './ChatroomPage.css';
import { ChatMessage } from '../../utils/interfaces';
import { getUID, useChatMessageReactions, useUserInfoUI } from '../../utils/firebase';
import { formatChatSentDate, scrollToLatestMessage } from '../../utils/functions';

const ChatroomChatMessage = (props: ChatMessage & {
  onReact: (x: number, y: number) => void;
  rid: string;
}) => {
  const reactions = useChatMessageReactions(props.rid, props.mid);
  const [ author, authorLoading ] = useUserInfoUI(props.author.id);
  const [ imageOpen, setImageOpen ] = useState(false);

  useEffect(() => {
    if (imageOpen) document.body.style.overflowY = 'hidden';
    else document.body.style.overflowY = 'scroll';
  }, [ imageOpen ]);

  const outgoing = props.author.id === getUID();
  const authorName = !!props.author.name ? props.author.name : props.author.id;

  return (
    <React.Fragment>
      <div className={ `chatroompage-chatmessage ${ outgoing ? 'outgoing' : 'incoming' }` }>
        { outgoing ? null : (
          <React.Fragment>
            <h2>{ authorName } <span>{ formatChatSentDate(props.sent) }</span></h2>
            <img src={ author?.photo } alt={ author?.username } />
          </React.Fragment>
        ) }
        <div onContextMenu={ (event) => {
          event.preventDefault();
          let x = event.clientX;
          if (document.documentElement.clientWidth - x < 300) x -= 220;
          props.onReact(
            (x / document.documentElement.clientWidth) * 100,
            (event.clientY / document.documentElement.clientHeight) * 100
          );
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
      { reactions.length === 0 ? null : (
        <div className="chatroompage-chatmessage-reactionlist" style={ {
          float: outgoing ? 'right' : 'left',
          padding: outgoing ? '0 20px' : '0 70px'
        } }>{ reactions.map((r) => r.reaction as string) }</div>
      ) }
    </React.Fragment>
  );
};

export default ChatroomChatMessage;
