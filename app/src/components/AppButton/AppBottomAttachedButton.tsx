import React from 'react';
import AppButton from './AppButton';

const AppBottomAttachedButton = (props: {
  text: string,
  loading?: boolean;
  onClick: () => void;
}) => {
  return (
    <React.Fragment>
      <div className="app-bottom-attached-button acrylic-transparent">
        <AppButton text={ props.text } onClick={ props.onClick } type="primary" loading={ props.loading } />
      </div>
      <div style={ { height: 90 } }></div>
    </React.Fragment>
  );
};

export default AppBottomAttachedButton;
