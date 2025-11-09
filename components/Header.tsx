import React from 'react';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="py-8 px-4 text-center relative">
       <div className="absolute top-1/2 -translate-y-1/2 right-4">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight sm:text-5xl">
        OpenNow
      </h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
        What’s open this week in your area?
      </p>
    </header>
  );
};

export default Header;