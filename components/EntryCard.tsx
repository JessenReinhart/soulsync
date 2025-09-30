import React, { useState } from 'react';
import { JournalEntry } from '../types';
import { MOOD_OPTIONS } from '../constants';
import Tag from './common/Tag';
import Button from './common/Button';
import Icon from './common/Icon';
import Modal from './common/Modal';
import { getFormattedDate, timeAgo } from '../utils/dateUtils';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';

interface EntryCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
}

const EntryCard: React.FC<EntryCardProps> = ({ entry, onEdit }) => {
  const deleteEntryAction = useAppStore(state => state.deleteEntry);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const moodOption = entry.mood ? MOOD_OPTIONS.find(mo => mo.level === entry.mood) : undefined;

  const handleDelete = () => {
    deleteEntryAction(entry.id);
    setShowDeleteConfirm(false);
  };

  const truncateContent = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
        className="bg-cardLight dark:bg-cardDark shadow-soft-lg rounded-xl p-6 mb-6 transition-shadow hover:shadow-soft-xl"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-semibold text-primaryDark dark:text-primaryLight">
            {entry.entryDate ? getFormattedDate(entry.entryDate) : 'No Date'}
          </h3>
          <p className="text-xs text-textLight/70 dark:text-textDark/70">
            Logged {timeAgo(new Date(entry.createdAt))}
            {entry.createdAt !== entry.updatedAt && ` (edited ${timeAgo(new Date(entry.updatedAt))})`}
          </p>
        </div>
        {moodOption && (
          <div className="flex flex-col items-center text-center ml-4">
            <span className="text-4xl">{moodOption.emoji}</span>
            <span className="text-xs text-textLight dark:text-textDark opacity-80">{moodOption.label}</span>
          </div>
        )}
      </div>

      {entry.content && (
        <p className="text-textLight dark:text-textDark whitespace-pre-wrap mb-4 leading-relaxed opacity-90">
          {truncateContent(entry.content)}
        </p>
      )}
      
      {entry.moodDescription && (
        <p className="text-sm italic text-textLight/70 dark:text-textDark/70 mb-4">
          Mood notes: "{entry.moodDescription}"
        </p>
      )}

      {(entry.tags.length > 0 || entry.moodTags && entry.moodTags.length > 0) && (
        <div className="mb-4">
          {entry.tags.length > 0 && (
            <div className="mb-1">
              <span className="text-xs font-semibold text-textLight/70 dark:text-textDark/70 mr-1">Journal Tags:</span>
              {entry.tags.map(tag => <Tag key={`j-${tag}`} text={tag} color="bg-primaryLight/70 text-primaryDark dark:bg-primaryDark/30 dark:text-primaryLight/90" />)}
            </div>
          )}
          {entry.moodTags && entry.moodTags.length > 0 && (
             <div className="mb-1">
               <span className="text-xs font-semibold text-textLight/70 dark:text-textDark/70 mr-1">Mood Tags:</span>
              {entry.moodTags.map(tag => <Tag key={`m-${tag}`} text={tag} color="bg-secondaryLight/70 text-secondaryDark dark:bg-secondaryDark/30 dark:text-secondaryLight/90" />)}
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4 border-t border-primaryLight/30 dark:border-primaryDark/30">
        <Button variant="ghost" size="sm" onClick={() => onEdit(entry)} leftIcon={<Icon name="edit" size={14}/>}>
          Edit
        </Button>
        <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)} leftIcon={<Icon name="trash" size={14}/>}>
          Delete
        </Button>
      </div>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Deletion"
        footerContent={
          <>
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleDelete}>Delete Entry</Button>
          </>
        }
      >
        <p>Are you sure you want to delete this journal entry from {getFormattedDate(entry.entryDate)}? This action cannot be undone.</p>
      </Modal>
    </motion.div>
  );
};

export default EntryCard;