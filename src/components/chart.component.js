import React from 'react';

const ChartComponent = ({ percentage }) => {
  return (
    <div style={{
      width: '200px',
      height: '300px',
      border: '2px solid black',
      position: 'relative',
      backgroundColor: 'white'
    }}>
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: `${percentage}%`,
        backgroundColor: 'blue'
      }} />
    </div>
  );
};

export default ChartComponent;
