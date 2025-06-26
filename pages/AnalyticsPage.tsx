
import React, { useMemo } from 'react';
import MoodOverTimeChart from '../components/charts/MoodOverTimeChart';
import TagFrequencyChart from '../components/charts/TagFrequencyChart';
import CalendarHeatmap from '../components/charts/CalendarHeatmap';
import { MoodLevel } from '../types'; // JournalEntry type removed as entries come from store
import { useAppStore } from '../store/appStore';
import Icon from '../components/common/Icon'; // For placeholder
import { MOOD_OPTIONS } from '../constants';


const AnalyticsPage: React.FC = () => {
  const entries = useAppStore(state => state.entries);

  const memoizedEntries = useMemo(() => entries, [entries]);

  const averageMoodData = useMemo(() => {
    const moodEntries = entries.filter(e => e.mood !== undefined);
    if (moodEntries.length === 0) return null;
    const sum = moodEntries.reduce((acc, curr) => acc + (curr.mood as MoodLevel), 0);
    const average = parseFloat((sum / moodEntries.length).toFixed(1));
    const closestMood = MOOD_OPTIONS.reduce((prev, curr) => 
        (Math.abs(curr.level - average) < Math.abs(prev.level - average) ? curr : prev)
    );
    return {
        value: average,
        emoji: closestMood.emoji,
        label: closestMood.label
    };
  }, [entries]);

  const journalStreak = useMemo(() => {
    if (entries.length === 0) return 0;
    const sortedDates = [...new Set(entries.map(e => e.entryDate))]
      .map(dateStr => new Date(dateStr as string))
      .sort((a, b) => b.getTime() - a.getTime());

    if (sortedDates.length === 0) return 0;

    let streak = 0;
    let today = new Date(); today.setHours(0,0,0,0);
    let yesterday = new Date(today); yesterday.setDate(today.getDate() -1);
    
    // Check if the most recent entry is today or yesterday
    if (sortedDates[0].getTime() === today.getTime() || sortedDates[0].getTime() === yesterday.getTime()){
        streak = 1;
        let currentDate = new Date(sortedDates[0]);
        for (let i = 1; i < sortedDates.length; i++) {
            let prevDateExpected = new Date(currentDate);
            prevDateExpected.setDate(currentDate.getDate() - 1);
            if (sortedDates[i].getTime() === prevDateExpected.getTime()) {
                streak++;
                currentDate = sortedDates[i];
            } else if (sortedDates[i].getTime() < prevDateExpected.getTime()){ 
                // Gap in dates, streak broken
                break;
            }
            // If sortedDates[i] is same as currentDate, it's multiple entries on same day, continue checking with currentDate
        }
    }
    return streak;
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="text-center py-10 animate-fade-in">
        <Icon name="barChart" size={60} className="mx-auto text-primaryLight dark:text-primaryDark opacity-50 mb-4" />
        <h2 className="text-2xl font-semibold text-textLight dark:text-textDark mb-2">Unlock Your Insights</h2>
        <p className="text-textLight dark:text-textDark opacity-70">
          Once you start journaling, this space will fill with beautiful visualizations of your journey.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title is now part of the App shell (DesktopTabbar or general header) */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
        <div className="bg-cardLight dark:bg-cardDark p-6 rounded-xl shadow-soft-lg">
            <h3 className="text-lg font-semibold text-primaryDark dark:text-primaryLight">Average Mood</h3>
            {averageMoodData ? (
                <>
                    <p className="text-3xl font-bold text-textLight dark:text-textDark mt-2">
                        {averageMoodData.value}/5 <span className="text-2xl">{averageMoodData.emoji}</span>
                    </p>
                    <p className="text-xs text-textLight dark:text-textDark opacity-70">{averageMoodData.label}</p>
                </>
            ) : (
                 <p className="text-3xl font-bold text-textLight dark:text-textDark mt-2">N/A</p>
            )}
            <p className="text-xs text-textLight dark:text-textDark opacity-60 mt-1">Based on logged moods</p>
        </div>
        <div className="bg-cardLight dark:bg-cardDark p-6 rounded-xl shadow-soft-lg">
            <h3 className="text-lg font-semibold text-primaryDark dark:text-primaryLight">Journaling Streak</h3>
            <p className="text-3xl font-bold text-textLight dark:text-textDark mt-2">{journalStreak} {journalStreak === 1 ? 'day' : 'days'}</p>
             <p className="text-xs text-textLight dark:text-textDark opacity-60 mt-1">Keep it up! Consistency is key.</p>
        </div>
      </div>

      <MoodOverTimeChart entries={memoizedEntries} />
      <TagFrequencyChart entries={memoizedEntries} />
      <CalendarHeatmap entries={memoizedEntries} />
      
      <p className="text-sm text-center text-textLight dark:text-textDark opacity-70 pt-4">
        Remember, these are just tools. The real insights come from your reflections.
      </p>
    </div>
  );
};

export default AnalyticsPage;