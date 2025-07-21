import React from 'react';

const Card = ({ title, children }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4 border-b pb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
};

export default Card;