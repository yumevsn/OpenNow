import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 px-4 text-center">
      <h1 className="text-4xl font-bold text-gray-800 tracking-tight sm:text-5xl">
        OpenNow
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        What’s open this week in your area?
      </p>
    </header>
  );
};

export default Header;
