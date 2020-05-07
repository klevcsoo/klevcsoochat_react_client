import React from 'react';
import './AppCard.css';

const AppCard = (props: { children: React.ReactNode; }) => {
  return (
    <div className="app-card">
      {props.children}
    </div>
  );
};

export default AppCard;
