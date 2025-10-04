import React from 'react';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="relative text-center pt-8 sm:pt-0">
      <div className="absolute top-0 right-0">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          AI Hashtag Generator
        </span>
      </h1>
      <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
        Boost your social media presence with perfectly crafted hashtags.
      </p>
    </header>
  );
};

export default Header;