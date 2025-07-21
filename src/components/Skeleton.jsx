import React from 'react';

const Skeleton = ({ className }) => {
  return <div className={`bg-slate-200 animate-pulse rounded-md ${className}`} />;
};

export default Skeleton;