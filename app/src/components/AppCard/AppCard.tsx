import React from 'react';
import './AppCard.css';

const AppCard = (props: { children: React.ReactNode; className?: string; }) => {
  return (
    // Just to avoid an empty space at the end of the class string
    <div className={ `app-card${props.className ? ` ${props.className}` : ''}` }>
      { props.children }
    </div>
  );
};

export default AppCard;
