import React from 'react';
import { JournalEntry, MoodLevel } from '../../types';
import Tooltip from './HeatmapTooltip'; 
import { useAppStore } from '../../store/appStore';

interface CalendarHeatmapProps {
  entries: JournalEntry[];
  year?: number;
}

const CalendarHeatmap: React.FC<CalendarHeatmapProps> = ({ entries, year }) => {
  const theme = useAppStore(state => state.settings.theme); 
  const isDarkMode = theme === 'dark';
  const currentYear = year || new Date().getFullYear();

  const [tooltipData, setTooltipData] = React.useState<{ x: number; y: number; date: string; mood?: MoodLevel, count: number } | null>(null);
  
  const getIntensityColor = (count: number, mood?: MoodLevel): string => {
    const baseHoverClass = isDarkMode ? 'hover:opacity-80' : 'hover:opacity-100 hover:ring-1 hover:ring-primaryDark/50';
    if (count === 0) return `${isDarkMode ? 'bg-primaryDark/10' : 'bg-primaryLight/30'} ${baseHoverClass}`;
    
    if (mood) {
       const moodColorMapping: Record<MoodLevel, string> = {
        [MoodLevel.AWFUL]: isDarkMode ? 'bg-red-500' : 'bg-red-400',
        [MoodLevel.BAD]: isDarkMode ? 'bg-orange-500' : 'bg-orange-400',
        [MoodLevel.NEUTRAL]: isDarkMode ? 'bg-yellow-500' : 'bg-yellow-400',
        [MoodLevel.GOOD]: isDarkMode ? 'bg-lime-500' : 'bg-lime-400', // Using brighter pastels for moods
        [MoodLevel.GREAT]: isDarkMode ? 'bg-green-500' : 'bg-green-400',
      };
      return `${moodColorMapping[mood]} ${baseHoverClass}`;
    }
    // Default color for entries without a specific mood, using primary shades
    if (count > 0 && count < 2) return `${isDarkMode ? 'bg-primaryDark/40' : 'bg-primaryLight'} ${baseHoverClass}`;
    if (count >= 2 && count < 4) return `${isDarkMode ? 'bg-primaryDark/60' : 'bg-primaryDark/70'} ${baseHoverClass}`;
    if (count >=4) return `${isDarkMode ? 'bg-primaryDark' : 'bg-primaryDark'} ${baseHoverClass}`;
    
    return `${isDarkMode ? 'bg-primaryDark/10' : 'bg-primaryLight/30'} ${baseHoverClass}`; // Fallback
  };

  const daysInYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365;
  const numDays = daysInYear(currentYear);
  const startDate = new Date(currentYear, 0, 1);
  const dayOfWeekOffset = (startDate.getDay() + 6) % 7; 

  const dataByDate: Record<string, { count: number; mood?: MoodLevel }> = {};
  entries.forEach(entry => {
    if (entry.entryDate && !isNaN(new Date(entry.entryDate).getTime()) && new Date(entry.entryDate).getFullYear() === currentYear) {
      dataByDate[entry.entryDate] = {
        count: (dataByDate[entry.entryDate]?.count || 0) + 1,
        mood: entry.mood || dataByDate[entry.entryDate]?.mood, 
      };
    }
  });

  const weeks = Array(Math.ceil((numDays + dayOfWeekOffset) / 7)).fill(null);
  const days = Array(numDays).fill(null).map((_, i) => {
    const date = new Date(currentYear, 0, i + 1);
    const dateString = date.toISOString().split('T')[0];
    return {
      date: dateString,
      ... (dataByDate[dateString] || { count: 0 }),
    };
  });
  
  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>, date: string, mood: MoodLevel | undefined, count: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipData({ x: rect.left + window.scrollX, y: rect.top + window.scrollY, date, mood, count });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let currentMonth = -1;
  const monthLabelPositions: {label: string, weekIndex: number}[] = [];

  return (
    <div className="bg-cardLight dark:bg-cardDark p-4 rounded-xl shadow-soft-lg overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4 text-textLight dark:text-textDark">Your Journaling Consistency ({currentYear})</h3>
      <div className="flex">
        <div className="grid grid-rows-7 gap-px w-10 mr-1 text-xs text-textLight dark:text-textDark opacity-70 text-center items-center">
            {/* These are just spacers, day labels are on top of columns now */}
            <div></div><div>Mon</div><div></div><div>Wed</div><div></div><div>Fri</div><div></div>
        </div>
        <div className="flex-grow">
            <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] gap-px mb-1">
                {weeks.map((_, weekIndex) => {
                    const firstDayOfWeek = new Date(currentYear, 0, (weekIndex * 7) - dayOfWeekOffset + 1);
                    const month = firstDayOfWeek.getMonth();
                    if (month !== currentMonth && (firstDayOfWeek.getDate() <= 7 || weekIndex === 0)) { // Show month label if it's the first week of the month or first week of grid
                        currentMonth = month;
                        if (!monthLabelPositions.find(p => p.label === monthLabels[currentMonth]) || monthLabelPositions[monthLabelPositions.length-1]?.label !== monthLabels[currentMonth]) {
                           monthLabelPositions.push({label: monthLabels[currentMonth], weekIndex});
                        }
                    }
                    if (weekIndex < monthLabelPositions[monthLabelPositions.length-1]?.weekIndex && monthLabelPositions.length > 0) return <div key={`month-spacer-${weekIndex}`}></div>; // empty div for spacing
                    
                    const labelInfo = monthLabelPositions.find(p => p.weekIndex === weekIndex);
                    return <div key={`month-${weekIndex}`} className="text-xs text-textLight dark:text-textDark opacity-70 text-center">{labelInfo?.label || ""}</div>;
                })}
            </div>
            <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] grid-rows-7 gap-px">
                {Array(dayOfWeekOffset).fill(null).map((_, i) => <div key={`offset-${i}`} className="w-4 h-4" />)}
                {days.map((dayData, i) => (
                    <div
                    key={i}
                    className={`w-4 h-4 rounded-sm transition-colors duration-150 cursor-pointer ${getIntensityColor(dayData.count, dayData.mood)}`}
                    onMouseEnter={(e) => handleMouseEnter(e, dayData.date, dayData.mood, dayData.count)}
                    onMouseLeave={handleMouseLeave}
                    />
                ))}
            </div>
        </div>
      </div>
       {tooltipData && (
        <Tooltip
          x={tooltipData.x}
          y={tooltipData.y}
          date={tooltipData.date}
          mood={tooltipData.mood}
          count={tooltipData.count}
        />
      )}
      <div className="flex justify-end items-center mt-4 space-x-2 text-xs text-textLight dark:text-textDark opacity-70">
        <span>Less</span>
        <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-primaryDark/10' : 'bg-primaryLight/30'}`}></div>
        <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-primaryDark/40' : 'bg-primaryLight'}`}></div>
        <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-primaryDark/60' : 'bg-primaryDark/70'}`}></div>
        <div className={`w-3 h-3 rounded-sm ${isDarkMode ? 'bg-primaryDark' : 'bg-primaryDark'}`}></div>
        <span>More</span>
      </div>
    </div>
  );
};

export default CalendarHeatmap;