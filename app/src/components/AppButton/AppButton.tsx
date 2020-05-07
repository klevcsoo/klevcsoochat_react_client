import React from 'react';
import './AppButton.css';

const AppButton = (props: {
  text: string,
  loading: boolean,
  type: 'primary' | 'secondary' | 'warning',
  onClick: () => void;
}) => {
  const handler = () => setTimeout(() => props.onClick(), 200);
  return (
    <button type="button" className={`app-button ${props.type}`} disabled={props.loading}
      onClick={handler}>
      <div>{props.text}</div>
    </button>
  );
};

export default AppButton;
