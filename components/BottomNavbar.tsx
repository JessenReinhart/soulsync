import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './common/Icon';
import { motion } from 'framer-motion';
import { TabItemConfig } from '../App'; // Import ViewId and TabItemConfig


interface BottomNavbarProps {
  items: TabItemConfig[];
}

const BottomNavbar: React.FC<BottomNavbarProps> = ({ items }) => {
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
            <NavLink
              key={item.viewId}
              to={`/${item.viewId}`}
              className={({ isActive }) =>
                `${iconBaseClass} ${isActive ? activeIconClass : inactiveIconClass} w-1/3`
              }
              aria-label={item.label}
            >
              <Icon name={item.icon} size={22} />
              <span className="text-xs mt-1">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default BottomNavbar;