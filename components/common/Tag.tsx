
import React from 'react';
import Icon from './Icon';

interface TagProps {
  text: string;
  color?: string; // Tailwind color class e.g. bg-blue-100 text-blue-800
  onClose?: () => void;
}

const Tag: React.FC<TagProps> = ({ text, color, onClose }) => {
  const defaultColor = "bg-secondaryLight text-secondaryDark dark:bg-opacity-30 dark:text-secondaryLight/90";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color || defaultColor} mr-1 mb-1 shadow-soft-sm`}
    >
      {text}
      {onClose && (
        <button
          type="button"
          className="flex-shrink-0 ml-1.5 -mr-0.5 p-0.5 rounded-full inline-flex items-center justify-center text-current hover:bg-black/10 dark:hover:bg-white/10"
          onClick={onClose}
          aria-label={`Remove tag ${text}`}
        >
          <Icon name="close" size={12} strokeWidth={3} />
        </button>
      )}
    </span>
  );
};

export default Tag;