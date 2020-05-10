import React from 'react';
import './ChatroomPage.css';
import AppPageHeader from '../../components/AppPageHeader/AppPageHeader';
import { useChatroomMetadata } from '../../utils/firebase';
import { useRouteMatch } from 'react-router-dom';
import LoadingOverlay from '../../components/LoadingOverlay';
import { routes } from '../../utils/constants';
import ChatroomMessageBar from './ChatroomMessageBar';
import ChatroomMessageList from './ChatroomMessageList';

const ChatroomPage = () => {
  const roomId = (useRouteMatch().params as any).id;
  const [ metadata, metadataLoading ] = useChatroomMetadata(roomId);

  return metadataLoading ? <LoadingOverlay /> : !metadata ? null : (
    <div className="chatroompage-container">
      <AppPageHeader title={metadata.name} previous={{ icon: 'home' }} next={{
        icon: 'settings',
        path: routes.CHATROOM_SETTINGS.replace(':id', roomId)
      }} />
      <ChatroomMessageList roomId={roomId} />
      <ChatroomMessageBar roomId={roomId} />
    </div>
  );
};

export default ChatroomPage;
