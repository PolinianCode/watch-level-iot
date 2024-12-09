import React from 'react';

const Tank = ({ percentage, lowerLimit, upperLimit }) => {

  let tankColor;
  if (percentage < lowerLimit) {
    tankColor = '#b83540'; 
  } else if (percentage >= lowerLimit && percentage <= upperLimit) {
    tankColor = '#f4a300'; 
  } else {
    tankColor = '#76c7c0';
  }

  return (
    <div style={{
      width: '50%',
      height: '50%',
      position: 'relative',
      backgroundColor: 'white',
      borderRadius: '10px'
    }}>
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: `${percentage}%`,
        backgroundColor: tankColor,
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
      }} />
    </div>
  );
};

export default Tank;
