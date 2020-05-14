import React from 'react';
import './AppCard.css';
import { useChatroomMetadata } from '../../utils/firebase';
import LoadingSpinner from '../LoadingSpinner';

const AppChatroomCard = (props: { id: string, reducedMargin?: boolean; }) => {
  const [ metadata, metadataLoading ] = useChatroomMetadata(props.id);

  return !metadataLoading && !metadata ? null : (
    <div className="app-card" style={{
      margin: `${props.reducedMargin ? '10' : '30'}px auto`
    }}>
      {metadataLoading ? <LoadingSpinner /> : !metadata ? null : (
        <div className="app-user-card chatroom">
          <img src={metadata.photo} alt={metadata.name} />
          <h2 className="app-small-header">{metadata.name}</h2>
          <h3>{metadata.id}</h3>
        </div>
      )}
    </div>
  );
};

export default AppChatroomCard;
