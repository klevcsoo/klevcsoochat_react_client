import React, { useState, useEffect } from 'react';
import './ChatroomPage.css';
import { ChatMessage } from '../../utils/interfaces';
import { getUID } from '../../utils/firebase';
import { formatChatSentDate, scrollToLatestMessage } from '../../utils/functions';

const ChatroomChatMessage = (props: ChatMessage) => {
  const [ imageOpen, setImageOpen ] = useState(false);
  const [ reactionsOpen, setReactionsOpen ] = useState(false);
  const [ reactionsPos, setReactionsPos ] = useState<[ number, number ]>([ 0, 0 ]);

  const rHandler = (event: React.MouseEvent) => {
    event.stopPropagation();
    const id = event.currentTarget.id;
    console.log(id);
    // setTimeout(() => setReactionsOpen(false), 1500);
  };

  useEffect(() => {
    if (imageOpen) document.body.style.overflowY = 'hidden';
    else document.body.style.overflowY = 'scroll';
  }, [ imageOpen ]);

  useEffect(() => {
    document.documentElement.onclick = () => {
      setReactionsOpen(false);
    };
  }, []);

  const outgoing = props.author.id === getUID();
  const authorName = !!props.author.name ? props.author.name : props.author.id;

  return (
    <React.Fragment>
      <div className={ `chatroompage-chatmessage ${ outgoing ? 'outgoing' : 'incoming' }` }>
        { !outgoing ? <h2>{ authorName } <span>{ formatChatSentDate(props.sent) }</span></h2> : null }
        { !reactionsOpen ? null : (
          <span className="chatroompage-chatmessage-reactions" style={ {
            top: `${ reactionsPos[ 1 ] }%`, left: `${ reactionsPos[ 0 ] }%`
          } } onClick={ (event) => event.stopPropagation() }>
            <span id="r-heart" role="img" aria-label="heart" onClick={ (e) => rHandler(e) }>❤️</span>
            <span id="r-laugh" role="img" aria-label="laugh" onClick={ (e) => rHandler(e) }>😂</span>
            <span id="r-sad" role="img" aria-label="sad" onClick={ (e) => rHandler(e) }>😢</span>
            <span id="r-suprised" role="img" aria-label="suprised" onClick={ (e) => rHandler(e) }>😮</span>
            <span id="r-like" role="img" aria-label="like" onClick={ (e) => rHandler(e) }>👍</span>
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
