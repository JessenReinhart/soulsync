import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { JournalEntry } from '../../types';
import { useAppStore } from '../../store/appStore'; 

interface TagFrequencyChartProps {
  entries: JournalEntry[];
}

const TagFrequencyChart: React.FC<TagFrequencyChartProps> = ({ entries }) => {
  const theme = useAppStore(state => state.settings.theme); 
  const isDarkMode = theme === 'dark';
  const textColor = isDarkMode ? '#E9D8FD' : '#4A3F55'; // textDark : textLight
  const gridColor = isDarkMode ? '#3E2C4A' : '#FDF7FF'; // cardDark : backgroundLight
  const barFillColor = isDarkMode ? '#F472B6' : '#F472B6'; // secondaryDark for both, or secondaryLight for dark

  const tagFrequencies: { [key: string]: number } = {};

  entries.forEach(entry => {
    entry.tags.forEach(tag => {
      tagFrequencies[tag] = (tagFrequencies[tag] || 0) + 1;
    });
    if (entry.moodTags) {
        entry.moodTags.forEach(tag => {
            tagFrequencies[tag] = (tagFrequencies[tag] || 0) + 1;
        });
    }
  });

  const data = Object.entries(tagFrequencies)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  if (data.length === 0) {
    return <p className="text-center text-textLight dark:text-textDark opacity-70 py-8">Add some tags to your entries to see their frequency!</p>;
  }
  
  const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
     if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded shadow-soft-lg border ${isDarkMode ? 'bg-cardDark border-primaryDark/30 text-textDark' : 'bg-cardLight border-primaryLight text-textLight'}`}>
          <p className="label text-sm">{`Tag: ${label}`}</p>
          <p className="intro text-sm">{`Count: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-96 bg-cardLight dark:bg-cardDark p-4 rounded-xl shadow-soft-lg">
      <h3 className="text-lg font-semibold mb-4 text-textLight dark:text-textDark">Your Most Common Themes</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis type="number" stroke={textColor} allowDecimals={false} />
          <YAxis type="category" dataKey="name" stroke={textColor} width={80} interval={0} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? 'rgba(167, 139, 250, 0.2)' : 'rgba(224, 215, 254, 0.4)' }}/>
          <Legend wrapperStyle={{ color: textColor }}/>
          <Bar dataKey="count" fill={barFillColor} name="Tag Count" barSize={20} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TagFrequencyChart;