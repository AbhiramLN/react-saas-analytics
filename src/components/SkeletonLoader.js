import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = () => {
  return (
    <div className="skeleton-loader">
      <div className="skeleton-header"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-text"></div>
      <div className="skeleton-line short"></div>
      <div className="skeleton-text short"></div>
    </div>
  );
};

export default SkeletonLoader;
