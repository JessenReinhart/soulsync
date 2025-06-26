
export enum MoodLevel {
  AWFUL = 1, // 😢
  BAD = 2,    // 😟
  NEUTRAL = 3,// 😐
  GOOD = 4,   // 😊
  GREAT = 5,  // 🤩
}

export interface JournalEntry {
  id: string; // UUID
  entryDate: string; // ISO date string for the day of the entry (e.g., "2023-10-27")
  createdAt: string; // ISO datetime string for when the entry was created
  updatedAt: string; // ISO datetime string for when the entry was last updated
  content: string;
  tags: string[];
  mood?: MoodLevel;
  moodDescription?: string; // Optional short text for mood
  moodTags?: string[];
}

export type Theme = 'light' | 'dark';

export interface AppSettings {
  theme: Theme;
  userName?: string;
  lastBackupReminderDismissedTs?: number; // Timestamp
  showPrompts: boolean;
}

export interface AppData {
  entries: JournalEntry[];
  settings: AppSettings;
}

// For AppContext
export type AppState = AppData;

export type AppAction =
  | { type: 'ADD_ENTRY'; payload: JournalEntry }
  | { type: 'UPDATE_ENTRY'; payload: JournalEntry }
  | { type: 'DELETE_ENTRY'; payload: string } // id
  | { type: 'LOAD_DATA'; payload: AppData }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_USER_NAME'; payload: string }
  | { type: 'DISMISS_BACKUP_REMINDER' }
  | { type: 'TOGGLE_PROMPTS'; payload: boolean };

export interface MoodOption {
  level: MoodLevel;
  emoji: string;
  label: string;
}
    