import React from 'react';
// Removed: import { NavLink, useLocation } from 'react-router-dom';
import Icon from './common/Icon';
import ToggleSwitch from './common/ToggleSwitch';
import { useAppStore } from '../store/appStore';
import { ViewId, TabItemConfig } from '../App'; // Import ViewId and TabItemConfig

interface DesktopTabbarProps {
  items: TabItemConfig[];
  currentView: ViewId;
  navigateTo: (viewId: ViewId) => void;
}

const DesktopTabbar: React.FC<DesktopTabbarProps> = ({ items, currentView, navigateTo }) => {
  const theme = useAppStore(state => state.settings.theme);
  const toggleThemeAction = useAppStore(state => state.toggleTheme);

  const linkBaseClass = "flex items-center px-4 py-3 text-sm font-medium transition-colors duration-150 ease-in-out border-b-2";
  const activeLinkClass = "border-primaryDark dark:border-primaryLight text-primaryDark dark:text-primaryLight";
  const inactiveLinkClass = "border-transparent text-textLight dark:text-textDark hover:text-primaryDark dark:hover:text-primaryLight hover:border-primaryLight dark:hover:border-primaryDark/50";

  return (
    <div className="bg-cardLight dark:bg-cardDark shadow-soft-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <nav className="flex space-x-2">
          {items.map(item => (
            <button
              key={item.viewId}
              onClick={() => navigateTo(item.viewId)}
              className={`${linkBaseClass} ${currentView === item.viewId ? activeLinkClass : inactiveLinkClass}`}
              aria-current={currentView === item.viewId ? 'page' : undefined}
            >
              <Icon name={item.icon} size={18} className="mr-2" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="py-2">
            <ToggleSwitch
                isOn={theme === 'dark'}
                onToggle={toggleThemeAction}
                onIcon={<Icon name="moon" size={16} className="text-primaryDark" />}
                offIcon={<Icon name="sun" size={16} className="text-secondaryDark" />}
            />
        </div>
      </div>
    </div>
  );
};

export default DesktopTabbar;