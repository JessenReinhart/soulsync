import React, { useState, useMemo } from 'react';
import JournalEntryForm from '../components/JournalEntryForm';
import EntryCard from '../components/EntryCard';
import { JournalEntry } from '../types';
import Button from '../components/common/Button';
import Icon from '../components/common/Icon';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import { MOOD_OPTIONS } from '../constants'; // For mood filter

const JournalPage: React.FC = () => {
  const entries = useAppStore(state => state.entries);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState<string>('');
  const [filterTag, setFilterTag] = useState<string>('');

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth'});
  };

  const handleSave = () => {
    setEditingEntry(null);
    setShowForm(false);
  };
  
  const handleCancelEdit = () => {
    setEditingEntry(null);
    setShowForm(false);
  };

  const toggleNewEntryForm = () => {
    setEditingEntry(null); // Ensure not editing when toggling for new
    setShowForm(prev => !prev);
  }

  const filteredEntries = useMemo(() => {
    return entries
      .filter(entry => {
        const searchTermLower = searchTerm.toLowerCase();
        const contentMatch = entry.content.toLowerCase().includes(searchTermLower);
        const tagsMatch = entry.tags.some(tag => tag.toLowerCase().includes(searchTermLower));
        const moodTagsMatch = entry.moodTags?.some(tag => tag.toLowerCase().includes(searchTermLower));
        const moodDescriptionMatch = entry.moodDescription?.toLowerCase().includes(searchTermLower);
        const searchMatch = contentMatch || tagsMatch || moodTagsMatch || moodDescriptionMatch || searchTerm === '';
        
        const moodMatch = filterMood === '' || (entry.mood !== undefined && entry.mood.toString() === filterMood);
        
        const tagFilterMatch = filterTag === '' || entry.tags.includes(filterTag) || entry.moodTags?.includes(filterTag);

        return searchMatch && moodMatch && tagFilterMatch;
      })
      .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime() || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [entries, searchTerm, filterMood, filterTag]);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    entries.forEach(entry => {
        entry.tags.forEach(tag => tagsSet.add(tag));
        entry.moodTags?.forEach(tag => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  }, [entries]);

  const inputStyle = "w-full md:flex-grow px-3 py-2 bg-cardLight dark:bg-cardDark border border-primaryLight/50 dark:border-primaryDark/40 rounded-md shadow-soft-sm focus:outline-none focus:ring-2 focus:ring-primaryDark dark:focus:ring-primaryLight focus:border-transparent sm:text-sm placeholder-textLight/60 dark:placeholder-textDark/60";

  return (
    <div className="space-y-8">
       <div className="flex justify-end items-center -mt-2 mb-6 md:mb-2"> {/* Button moved above filters for better layout */}
        {!showForm && !editingEntry && (
             <Button onClick={toggleNewEntryForm} variant="primary" leftIcon={<Icon name="plus" size={18} />}>
                New Entry
            </Button>
        )}
      </div>

      <AnimatePresence>
      {(showForm || editingEntry) && (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8" // Add margin bottom when form is shown
        >
            <JournalEntryForm
            key={editingEntry ? editingEntry.id : 'new-entry'}
            entryToEdit={editingEntry}
            onSave={handleSave}
            onCancel={editingEntry ? handleCancelEdit : handleCancelEdit} // Same cancel logic
            />
        </motion.div>
      )}
      </AnimatePresence>


      {entries.length > 0 && !editingEntry && !showForm && (
        <div className="p-4 bg-cardLight dark:bg-cardDark rounded-lg shadow-soft-md space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4 mb-6">
            <input 
                type="text"
                placeholder="Search entries & tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={inputStyle}
            />
             <select
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
                className={`${inputStyle} w-full md:w-auto`}
            >
                <option value="">All Moods</option>
                {MOOD_OPTIONS.map(opt => (
                     <option key={opt.level} value={opt.level.toString()}>{opt.emoji} {opt.label}</option>
                ))}
            </select>
            {allTags.length > 0 && (
                 <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className={`${inputStyle} w-full md:w-auto`}
                >
                    <option value="">All Tags</option>
                    {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                </select>
            )}
        </div>
      )}

      {!editingEntry && !showForm && (
        filteredEntries.length > 0 ? (
          <motion.div layout className="space-y-6">
            <AnimatePresence>
                {filteredEntries.map(entry => (
                    <EntryCard key={entry.id} entry={entry} onEdit={handleEdit} />
                ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="text-center py-10">
            {/* Using a generic placeholder image or an SVG icon would be better than picsum */}
            <Icon name="moon" size={60} className="mx-auto text-primaryLight dark:text-primaryDark opacity-50 mb-4" />
            <p className="text-textLight dark:text-textDark opacity-70">
              {entries.length === 0 ? "It looks like your journal is empty. Why not start with your first entry?" : "No entries match your current filters. Try adjusting them!"}
            </p>
            {entries.length === 0 && ( // Show button only if journal is completely empty
                 <Button onClick={toggleNewEntryForm} variant="primary" className="mt-6" leftIcon={<Icon name="plus" size={18} />}>
                    Create Your First Entry
                </Button>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default JournalPage;