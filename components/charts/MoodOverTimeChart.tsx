import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { JournalEntry, MoodLevel } from '../../types';
import { MOOD_OPTIONS } from '../../constants';
import { getFormattedDate } from '../../utils/dateUtils';
import { useAppStore } from '../../store/appStore'; 

interface MoodOverTimeChartProps {
  entries: JournalEntry[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  const theme = useAppStore.getState().settings.theme; // Get theme for tooltip styling
  const isDarkMode = theme === 'dark';

  if (active && payload && payload.length) {
    const moodLevel = payload[0].value as MoodLevel;
    const moodOption = MOOD_OPTIONS.find(m => m.level === moodLevel);
    return (
      <div className={`p-3 rounded shadow-soft-lg border ${isDarkMode ? 'bg-cardDark border-primaryDark/30 text-textDark' : 'bg-cardLight border-primaryLight text-textLight'}`}>
        <p className="label text-sm">{`Date: ${getFormattedDate(label)}`}</p>
        {moodOption && <p className="intro text-sm">{`Mood: ${moodOption.emoji} ${moodOption.label}`}</p>}
        {payload[0].payload.moodDescription && <p className="text-xs italic opacity-80">{`"${payload[0].payload.moodDescription}"`}</p>}
      </div>
    );
  }
  return null;
};

const MoodOverTimeChart: React.FC<MoodOverTimeChartProps> = ({ entries }) => {
  const theme = useAppStore(state => state.settings.theme);
  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? '#E9D8FD' : '#4A3F55'; // textDark : textLight
  const gridColor = isDarkMode ? '#3E2C4A' : '#FDF7FF'; // cardDark : backgroundLight (or primaryLight/30)
  const lineColor = isDarkMode ? '#A78BFA' : '#A78BFA'; // primaryDark for both, or primaryLight for dark theme
  const neutralLineColor = isDarkMode ? '#57486B' : '#E0D7FE'; // Muted lavender vs primaryLight

  const data = entries
    .filter(entry => entry.mood !== undefined)
    .map(entry => ({
      date: entry.entryDate,
      mood: entry.mood as MoodLevel,
      moodDescription: entry.moodDescription,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (data.length === 0) {
    return <p className="text-center text-textLight dark:text-textDark opacity-70 py-8">Log some moods to see your trend over time!</p>;
  }
  
  const xTickCount = Math.min(data.length, 7); 
  const xTickInterval = data.length > xTickCount ? Math.floor(data.length / xTickCount) : 0;

  return (
    <div className="h-96 bg-cardLight dark:bg-cardDark p-4 rounded-xl shadow-soft-lg">
      <h3 className="text-lg font-semibold mb-4 text-textLight dark:text-textDark">Your Mood Journey</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(tick) => getFormattedDate(tick, { month: 'short', day: 'numeric' })} 
            stroke={textColor}
            angle={-30}
            textAnchor="end"
            height={60}
            interval={xTickInterval}
          />
          <YAxis 
            domain={[1, 5]} 
            ticks={[1, 2, 3, 4, 5]} 
            tickFormatter={(tick: MoodLevel) => MOOD_OPTIONS.find(m => m.level === tick)?.emoji || ''}
            stroke={textColor}
            width={40}
           />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: textColor }} />
          <Line 
            type="monotone" 
            dataKey="mood" 
            stroke={lineColor}
            strokeWidth={2} 
            dot={{ r: 4, fill: lineColor }}
            activeDot={{ r: 6 }}
            name="Mood Level"
          />
          <ReferenceLine y={3} label={{ value: "Neutral", position: 'insideLeft', fill:textColor, dy: -5, dx: 5, fontSize: '0.75rem' }} stroke={neutralLineColor} strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodOverTimeChart;