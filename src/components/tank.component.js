import React from 'react';

const Tank = ({ percentage }) => {
  return (
    <div style={{
      width: '50%',
      height: '50%',
      position: 'relative',
      backgroundColor: 'white'
    }}>
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: `${percentage}%`,
        backgroundColor: '#b83540'
      }} />
    </div>
  );
};

export default Tank;
