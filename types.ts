export enum MoodLevel {
  AWFUL = 1,
  BAD = 2,
  NEUTRAL = 3,
  GOOD = 4,
  GREAT = 5,
}

export interface JournalEntry {
  id: string;
  entryDate: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  tags: string[];
  mood?: MoodLevel;
  moodDescription?: string;
  moodTags?: string[];
}

export type Theme = "light" | "dark";

export interface AppSettings {
  theme: Theme;
  userName?: string;
  lastBackupReminderDismissedTs?: number;
  showPrompts: boolean;
  openRouterApiKey?: string;
}

export interface AppData {
  entries: JournalEntry[];
  settings: AppSettings;
}

export type AppState = AppData;

export type AppAction =
  | { type: "ADD_ENTRY"; payload: JournalEntry }
  | { type: "UPDATE_ENTRY"; payload: JournalEntry }
  | { type: "DELETE_ENTRY"; payload: string }
  | { type: "LOAD_DATA"; payload: AppData }
  | { type: "SET_THEME"; payload: Theme }
  | { type: "SET_USER_NAME"; payload: string }
  | { type: "DISMISS_BACKUP_REMINDER" }
  | { type: "TOGGLE_PROMPTS"; payload: boolean };

export interface MoodOption {
  level: MoodLevel;
  emoji: string;
  label: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}
