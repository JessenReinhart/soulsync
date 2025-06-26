
import React from 'react';
import { APP_NAME } from '../constants';

const motivationalQuotes: string[] = [
  "Your feelings are valid.",
  "Every small step counts towards big progress.",
  "Be kind to yourself today.",
  "The journey of a thousand miles begins with a single step.",
  "You are stronger than you think."
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <footer className="bg-backgroundLight dark:bg-backgroundDark text-center py-8 border-t border-primaryLight/30 dark:border-primaryDark/30 mt-auto pb-24 md:pb-8"> {/* Added pb-24 for mobile to clear bottom nav */}
      <p className="text-sm text-textLight dark:text-textDark opacity-80 mb-2">
        "{randomQuote}"
      </p>
      <p className="text-xs text-textLight dark:text-textDark opacity-60">
        &copy; {currentYear} {APP_NAME}. Your thoughts, your space.
      </p>
      <p className="text-xs text-textLight dark:text-textDark opacity-60 mt-2">
        Made with Love ❤️ by <a href="https://jessenreinhart.github.io" target="_blank" rel="noopener noreferrer" className="text-primaryDark dark:text-primaryLight hover:underline">Jessen</a>
      </p>
    </footer>
  );
};

export default Footer;
