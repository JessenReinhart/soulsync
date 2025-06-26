
import React, { useState, KeyboardEvent } from 'react';
import Tag from './common/Tag';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onTagsChange, placeholder = "Add a tag...", label }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-textLight dark:text-textDark mb-1">{label}</label>}
      <div className="flex flex-wrap items-center p-2 border border-primaryLight/50 dark:border-primaryDark/40 rounded-lg bg-cardLight dark:bg-cardDark focus-within:ring-2 focus-within:ring-primaryDark dark:focus-within:ring-primaryLight focus-within:border-transparent shadow-soft-sm">
        {tags.map(tag => (
          <Tag key={tag} text={tag} onClose={() => removeTag(tag)} color="bg-primaryLight text-primaryDark dark:bg-opacity-40 dark:text-primaryLight/90" />
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder={tags.length > 0 ? "" : placeholder}
          className="flex-grow p-1 bg-transparent focus:outline-none text-sm text-textLight dark:text-textDark placeholder-textLight/60 dark:placeholder-textDark/60"
        />
      </div>
    </div>
  );
};

export default TagInput;