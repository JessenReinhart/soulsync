import React from 'react';
import { motion, Transition } from 'framer-motion';

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  label?: string;
  onIcon?: React.ReactNode;
  offIcon?: React.ReactNode;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, onToggle, label, onIcon, offIcon }) => {
  const spring: Transition = { // Explicitly typed
    type: "spring",
    stiffness: 700,
    damping: 30
  };

  return (
    <label className="flex items-center cursor-pointer select-none">
      {label && <span className="mr-3 text-sm font-medium text-textLight dark:text-textDark">{label}</span>}
      <div
        className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 shadow-inner ${
          isOn ? 'bg-primaryDark' : 'bg-primaryLight/50 dark:bg-primaryDark/30'
        }`}
        onClick={onToggle}
      >
        <motion.div
          className="absolute w-6 h-6 bg-white dark:bg-slate-200 rounded-full shadow-md flex items-center justify-center"
          layout
          transition={spring}
          style={{ [isOn ? 'right' : 'left']: '0.25rem' }} // Corresponds to p-1
        >
          {isOn ? onIcon : offIcon}
        </motion.div>
      </div>
    </label>
  );
};

export default ToggleSwitch;