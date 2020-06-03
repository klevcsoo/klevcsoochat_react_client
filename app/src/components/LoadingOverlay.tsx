import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingOverlay = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      bottom: 0, right: 0,
      zIndex: 5000
    }} className="acrylic-transparent">
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)'
      }}><LoadingSpinner /></div>
    </div>
  );
};

export default LoadingOverlay;
