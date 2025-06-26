
import React from 'react';
import { MoodLevel, MoodOption } from '../types';
import { MOOD_OPTIONS } from '../constants';
import { motion } from 'framer-motion';

interface MoodSelectorProps {
  selectedMood?: MoodLevel;
  onSelectMood: (mood: MoodLevel) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ selectedMood, onSelectMood }) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-textLight dark:text-textDark mb-2">How are you feeling?</h3>
      <div className="flex space-x-2 justify-around p-2 bg-primaryLight/20 dark:bg-primaryDark/20 rounded-lg shadow-soft-sm">
        {MOOD_OPTIONS.map((option: MoodOption) => (
          <motion.button
            key={option.level}
            type="button"
            onClick={() => onSelectMood(option.level)}
            className={`p-2 rounded-lg transition-all duration-200 text-3xl
              ${selectedMood === option.level 
                ? 'bg-primaryDark dark:bg-primaryLight scale-110 ring-2 ring-offset-2 ring-primaryDark dark:ring-primaryLight ring-offset-backgroundLight dark:ring-offset-backgroundDark shadow-soft-md' 
                : 'hover:bg-primaryLight/50 dark:hover:bg-primaryDark/40'
              }`}
            whileHover={{ scale: selectedMood === option.level ? 1.1 : 1.05 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Select mood: ${option.label}`}
          >
            {option.emoji}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;