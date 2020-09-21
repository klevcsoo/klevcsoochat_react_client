import React, { useEffect, useState } from 'react';
import './ChatroomPage.css';
import AppPageHeader from '../../components/AppPageHeader/AppPageHeader';
import { setTypingStatus, useChatroomMetadata, reactToMessage } from '../../utils/firebase';
import { useRouteMatch } from 'react-router-dom';
import LoadingOverlay from '../../components/LoadingOverlay';
import { routes } from '../../utils/constants';
import ChatroomMessageBar from './ChatroomMessageBar';
import ChatroomMessageList from './ChatroomMessageList';

const ChatroomPage = () => {
  const roomId = (useRouteMatch().params as any).id;
  const [ metadata, metadataLoading ] = useChatroomMetadata(roomId);

  const [ reactionsOpen, setReactionsOpen ] = useState(false);
  const [ reactionsPos, setReactionsPos ] = useState<[ number, number ]>([ 0, 0 ]);
  const [ reactionMid, setReactionMid ] = useState<string>();

  const rHandler = (event: React.MouseEvent) => {
    event.stopPropagation();
    const id = event.currentTarget.id;
    if (!reactionMid) return;
    reactToMessage(roomId, reactionMid, id).then(() => {
      console.log(`Reacted to ${ reactionMid } with ${ id }`);
    }).catch((err) => console.error(err.message));
    setReactionsOpen(false);
  };

  useEffect(() => {
    document.documentElement.onclick = (event) => {
      if ((event.target as HTMLSpanElement).id.startsWith('r-')) return;
      setReactionsOpen(false); setReactionMid(undefined);
    };
  }, []);

  useEffect(() => {
    return () => { setTypingStatus(false, roomId); };
  }, [ roomId ]);

  return metadataLoading ? <LoadingOverlay /> : !metadata ? null : (
    <div className="chatroompage-container">
      <AppPageHeader title={ metadata.name } previous={ { icon: 'home' } } next={ {
        icon: 'settings',
        path: routes.CHATROOM_SETTINGS.replace(':id', roomId)
      } } />
      <ChatroomMessageList roomId={ roomId } onReact={ (mid, x, y) => {
        setReactionsOpen(true); setReactionsPos([ x, y ]); setReactionMid(mid);
      } } />
      <ChatroomMessageBar roomId={ roomId } />
      { !reactionsOpen ? null : (
        <span className="chatroompage-chatmessage-reactions acrylic-transparent" style={ {
          top: `${ reactionsPos[ 1 ] }%`, left: `${ reactionsPos[ 0 ] }%`
        } } onClick={ (event) => event.stopPropagation() }>
          <span id="r-heart" role="img" aria-label="heart" onClick={ (e) => rHandler(e) }>❤️</span>
          <span id="r-laugh" role="img" aria-label="laugh" onClick={ (e) => rHandler(e) }>😂</span>
          <span id="r-sad" role="img" aria-label="sad" onClick={ (e) => rHandler(e) }>😢</span>
          <span id="r-suprised" role="img" aria-label="suprised" onClick={ (e) => rHandler(e) }>😮</span>
          <span id="r-like" role="img" aria-label="like" onClick={ (e) => rHandler(e) }>👍</span>
        </span>
      ) }
    </div>
  );
};

export default ChatroomPage;
