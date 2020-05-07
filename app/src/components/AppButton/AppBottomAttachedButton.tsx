import React from 'react';
import AppButton from './AppButton';

const AppBottomAttachedButton = (props: {
  text: string,
  onClick: () => void;
}) => {
  return (
    <React.Fragment>
      <div className="app-bottom-attached-button">
        <AppButton text={props.text} onClick={props.onClick} type="primary" />
      </div>
      <div style={{ height: 90 }}></div>
    </React.Fragment>
  );
};

export default AppBottomAttachedButton;
