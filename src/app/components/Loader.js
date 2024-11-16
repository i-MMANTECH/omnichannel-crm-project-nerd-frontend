import React from 'react';

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-green-500 h-2 z-50">
      <div className="w-full h-full bg-green-500 animate-pulse"></div>
    </div>
  );
};

export default Loader;
