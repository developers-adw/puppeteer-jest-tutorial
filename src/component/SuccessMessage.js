import React from 'react';

export default function Success() {
  return (
    <div>
      <div className='wincc'>
        <div className='box'></div>
        <div className='check'></div>
      </div>
      <h3 data-testid='success' className='success'>
        Success!!
      </h3>
    </div>
  );
}
