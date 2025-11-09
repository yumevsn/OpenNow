import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  isOffline: boolean;
}

const Header: React.FC<HeaderProps> = ({ isOffline }) => {
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
      {isOffline && (
        <div className="mt-4 inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900/50 px-3 py-1 text-sm font-medium text-yellow-800 dark:text-yellow-300 animate-pulse">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m12.728 0L5.636 18.364m0-12.728L18.364 18.364" /></svg>
          You're currently offline. Data may be outdated.
        </div>
      )}
    </header>
  );
};

export default Header;