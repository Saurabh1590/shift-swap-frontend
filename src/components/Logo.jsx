import React from 'react';

const Logo = ({ size = 40 }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Icon Background */}
        <rect width="24" height="24" rx="6" fill="#2563EB"/>

        {/* Calendar Shape */}
        <path d="M4 7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V7Z" fill="white"/>
        
        {/* Calendar Top Bar */}
        <path d="M20 7H4V9H20V7Z" fill="#E5E7EB"/>
        <circle cx="8" cy="7" r="1" fill="#2563EB"/>
        <circle cx="16" cy="7" r="1" fill="#2563EB"/>

        {/* Swap Arrows */}
        <path d="M14.5 12.5C14.5 11.1716 13.3284 10 12 10C10.6716 10 9.5 11.1716 9.5 12.5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 12.5H9.5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.5 16.5C9.5 17.8284 10.6716 19 12 19C13.3284 19 14.5 17.8284 14.5 16.5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13 16.5H14.5" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14.5 12.5L16 14" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.5 16.5L8 15" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
};

export default Logo;