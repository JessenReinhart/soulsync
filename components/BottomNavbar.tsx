import React from 'react';
// Removed: import { NavLink, useLocation } from 'react-router-dom';
import Icon from './common/Icon';
import { motion } from 'framer-motion';
// Removed: import ToggleSwitch from './common/ToggleSwitch';
// Removed: import { useAppStore } from '../store/appStore';
import { ViewId, TabItemConfig } from '../App'; // Import ViewId and TabItemConfig


interface BottomNavbarProps {
  items: TabItemConfig[];
  currentView: ViewId;
  navigateTo: (viewId: ViewId) => void;
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({ items, currentView, navigateTo }) => {
  // Theme toggle is now in DesktopTabbar, removed from here for simplicity unless specifically requested
  // const theme = useAppStore(state => state.settings.theme);
  // const toggleThemeAction = useAppStore(state => state.toggleTheme);

  const iconBaseClass = "flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none";
  const activeIconClass = "text-primaryDark dark:text-primaryLight";
  const inactiveIconClass = "text-textLight/70 dark:text-textDark/70 hover:text-primaryDark dark:hover:text-primaryLight";

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div className="bg-cardLight/80 dark:bg-cardDark/80 backdrop-blur-md shadow-soft-xl mx-4 mb-4 rounded-xl p-2">
        <div className="flex justify-around items-center h-14">
          {items.map((item) => (
            <button
              key={item.viewId}
              onClick={() => navigateTo(item.viewId)}
              className={`${iconBaseClass} ${currentView === item.viewId ? activeIconClass : inactiveIconClass} w-1/3`}
              aria-label={item.label}
              aria-current={currentView === item.viewId ? 'page' : undefined}
            >
              <Icon name={item.icon} size={22} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
          {/* Theme toggle could be added here as an extra button if needed */}
        </div>
      </div>
    </motion.nav>
  );
};

export default BottomNavbar;