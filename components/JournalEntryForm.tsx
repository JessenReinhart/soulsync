import React, { useState, useEffect, useCallback } from "react";
import { JournalEntry, MoodLevel } from "../types";
import MoodSelector from "./MoodSelector";
import TagInput from "./TagInput";
import Button from "./common/Button";
import { DAILY_WRITING_PROMPTS } from "../constants";
import { formatDateISO } from "../utils/dateUtils";
import Icon from "./common/Icon";
import { useAppStore } from "../store/appStore";

interface JournalEntryFormProps {
  entryToEdit?: JournalEntry | null;
  onSave?: () => void;
  onCancel?: () => void;
  targetDate?: Date;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  entryToEdit,
  onSave,
  onCancel,
  targetDate,
}) => {
  const addEntry = useAppStore((state) => state.addEntry);
  const updateEntry = useAppStore((state) => state.updateEntry);
  const settings = useAppStore((state) => state.settings);

  const [entryDate, setEntryDate] = useState<string>(
    targetDate ? formatDateISO(targetDate) : formatDateISO(new Date()),
  );
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<MoodLevel | undefined>(
    undefined,
  );
  const [moodDescription, setMoodDescription] = useState("");
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [dailyPrompt, setDailyPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (entryToEdit) {
      setEntryDate(entryToEdit.entryDate);
      setContent(entryToEdit.content);
      setTags(entryToEdit.tags || []);
      setSelectedMood(entryToEdit.mood);
      setMoodDescription(entryToEdit.moodDescription || "");
      setMoodTags(entryToEdit.moodTags || []);
      setDailyPrompt("");
    } else {
      setEntryDate(
        targetDate ? formatDateISO(targetDate) : formatDateISO(new Date()),
      );
      setContent("");
      setTags([]);
      setSelectedMood(undefined);
      setMoodDescription("");
      setMoodTags([]);
      if (settings.showPrompts) {
        setDailyPrompt(
          DAILY_WRITING_PROMPTS[
            Math.floor(Math.random() * DAILY_WRITING_PROMPTS.length)
          ],
        );
      } else {
        setDailyPrompt("");
      }
    }
  }, [entryToEdit, targetDate, settings.showPrompts]);

  const performSave = useCallback(() => {
    if (!content.trim() && !selectedMood) {
      alert("Please write something or select a mood to save your entry.");
      return;
    }
    setIsLoading(true);

    const entryData: Omit<JournalEntry, "createdAt" | "updatedAt"> & {
      id?: string;
    } = {
      id: entryToEdit?.id || "",
      entryDate,
      content: content.trim(),
      tags,
      mood: selectedMood,
      moodDescription: moodDescription.trim(),
      moodTags,
    };

    if (entryToEdit?.id) {
      updateEntry({
        ...entryData,
        id: entryToEdit.id,
        createdAt: entryToEdit.createdAt,
        updatedAt: entryToEdit.updatedAt,
      });
    } else {
      addEntry(entryData);
    }

    setIsLoading(false);
    if (onSave) onSave();

    if (!entryToEdit) {
      setContent("");
      setTags([]);
      setSelectedMood(undefined);
      setMoodDescription("");
      setMoodTags([]);
      if (settings.showPrompts) {
        setDailyPrompt(
          DAILY_WRITING_PROMPTS[
            Math.floor(Math.random() * DAILY_WRITING_PROMPTS.length)
          ],
        );
      }
    }
  }, [
    content,
    selectedMood,
    setIsLoading,
    entryDate,
    tags,
    moodDescription,
    moodTags,
    updateEntry,
    addEntry,
    onSave,
    entryToEdit,
    settings.showPrompts,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSave();
  };

  const handleKeyDown = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        performSave();
      }
    },
    [performSave],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const inputStyle =
    "mt-1 block w-full px-3 py-2 bg-cardLight dark:bg-cardDark border border-primaryLight/50 dark:border-primaryDark/40 rounded-md shadow-soft-sm focus:outline-none focus:ring-2 focus:ring-primaryDark dark:focus:ring-primaryLight focus:border-transparent sm:text-sm placeholder-textLight/60 dark:placeholder-textDark/60";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 p-6 bg-cardLight dark:bg-cardDark shadow-soft-lg rounded-xl animate-fade-in"
    >
      <div>
        <label
          htmlFor="entryDate"
          className="block text-sm font-medium text-textLight dark:text-textDark"
        >
          Entry Date
        </label>
        <input
          type="date"
          id="entryDate"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
          className={inputStyle}
          required
        />
      </div>

      {dailyPrompt && !entryToEdit && (
        <div className="p-3 bg-secondaryLight/30 dark:bg-secondaryDark/20 rounded-lg text-sm text-secondaryDark dark:text-secondaryLight/90 shadow-soft-sm">
          <p className="font-medium">Today's prompt:</p>
          <p>{dailyPrompt}</p>
        </div>
      )}

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-textLight dark:text-textDark"
        >
          {entryToEdit ? "Your Reflections" : "Let your thoughts flow..."}
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          className={inputStyle}
          placeholder="What's on your mind? Your feelings, experiences, or anything you'd like to note..."
        />
      </div>

      <MoodSelector
        selectedMood={selectedMood}
        onSelectMood={setSelectedMood}
      />

      {selectedMood && (
        <div>
          <label
            htmlFor="moodDescription"
            className="block text-sm font-medium text-textLight dark:text-textDark"
          >
            A few words about your mood? (Optional)
          </label>
          <input
            type="text"
            id="moodDescription"
            value={moodDescription}
            onChange={(e) => setMoodDescription(e.target.value)}
            className={inputStyle}
            placeholder="e.g., Feeling tired from work, excited for the weekend"
          />
        </div>
      )}

      <TagInput
        tags={tags}
        onTagsChange={setTags}
        label="Journal Tags"
        placeholder="Add journal tags (e.g., work, personal)"
      />

      {selectedMood && (
        <TagInput
          tags={moodTags}
          onTagsChange={setMoodTags}
          label="Mood Tags"
          placeholder="Add mood tags (e.g., stress, joy)"
        />
      )}

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={!content.trim() && !selectedMood}
        >
          {entryToEdit ? "Update Entry" : "Save Entry"}
          <Icon name="plus" size={16} className="ml-2" />
        </Button>
      </div>
      <p className="text-xs text-textLight/70 dark:text-textDark/70 text-right">
        Pro tip: Use Ctrl+S (or Cmd+S) to quickly save.
      </p>
    </form>
  );
};

export default JournalEntryForm;
