
import React from 'react';
import ReactDOM from 'react-dom';
import { MoodLevel } from '../../types';
import { MOOD_OPTIONS } from '../../constants';
import { getFormattedDate } from '../../utils/dateUtils';
import { useAppStore } from '../../store/appStore';

interface HeatmapTooltipProps {
  x: number;
  y: number;
  date: string;
  mood?: MoodLevel;
  count: number;
}

const HeatmapTooltip: React.FC<HeatmapTooltipProps> = ({ x, y, date, mood, count }) => {
  const theme = useAppStore.getState().settings.theme;
  const isDarkMode = theme === 'dark';
  const portalRoot = document.getElementById('root'); 

  if (!portalRoot) return null;

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${x + 8}px`, // Position slightly to the right of the square
    top: `${y - 30}px`, // Position slightly above the square, adjusted for tooltip height
    transform: 'translateY(-50%)', // Center vertically
    pointerEvents: 'none',
    zIndex: 1000,
  };

  return ReactDOM.createPortal(
    <div 
      style={style} 
      className={`text-xs rounded-md shadow-soft-lg p-2 whitespace-nowrap
        ${isDarkMode 
          ? 'bg-cardDark text-textDark border border-primaryDark/30' 
          : 'bg-cardLight text-textLight border border-primaryLight'
        }`}
    >
      <div>{getFormattedDate(date)}</div>
      {count > 0 && <div>Entries: {count}</div>}
      {mood && MOOD_OPTIONS.find(m => m.level === mood) && 
        <div>Mood: {MOOD_OPTIONS.find(m => m.level === mood)?.emoji} {MOOD_OPTIONS.find(m => m.level === mood)?.label}</div>
      }
      {count === 0 && <div>No entries</div>}
    </div>,
    portalRoot
  );
};

export default HeatmapTooltip;