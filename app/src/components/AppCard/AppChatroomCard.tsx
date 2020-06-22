import React from 'react';
import './AppCard.css';
import { useChatroomMetadata } from '../../utils/firebase';
import LoadingSpinner from '../LoadingSpinner';
import { useHistory } from 'react-router-dom';
import { routes } from '../../utils/constants';

const AppChatroomCard = (props: { id: string, reducedMargin?: boolean; request?: boolean; }) => {
  const history = useHistory();
  const [ metadata, metadataLoading ] = useChatroomMetadata(props.id);

  return !metadataLoading && !metadata ? null : (
    <div className="app-card" style={ {
      margin: `${props.reducedMargin ? '10' : '30'}px auto`
    } } onClick={ () => { if (!props.request) history.push(routes.CHATROOM.replace(':id', props.id)); } }>
      { metadataLoading ? <LoadingSpinner /> : !metadata ? null : (
        <div className={ `app-user-card chatroom${props.request ? ' request' : ''}` }>
          <img src={ metadata.photo } alt={ metadata.name } />
          <h2 className="app-small-header">{ metadata.name }</h2>
          <h3>{ metadata.id }</h3>
        </div>
      ) }
    </div>
  );
};

export default AppChatroomCard;
