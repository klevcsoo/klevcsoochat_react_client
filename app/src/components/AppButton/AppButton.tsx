import React from 'react';
import './AppButton.css';
import LoadingSpinner from '../LoadingSpinner';

const AppButton = (props: {
  text: string,
  loading?: boolean,
  type: 'primary' | 'secondary' | 'warning',
  onClick: () => void;
}) => {
  const handler = () => setTimeout(() => props.onClick(), 200);
  return (
    <button type="button" className={ `app-button ${props.type}` } disabled={ !!props.loading }
      onClick={ handler }>
      <div>
        { props.loading ? <LoadingSpinner /> : null }
        <div><div className="text">{ props.text }</div></div>
      </div>
    </button>
  );
};

export default AppButton;
