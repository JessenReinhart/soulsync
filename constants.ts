
import { MoodLevel, MoodOption } from './types';

export const APP_NAME = "SoulSync";
export const LOCAL_STORAGE_APP_DATA_KEY = "soulSyncAppData";

export const DAILY_WRITING_PROMPTS: string[] = [
  "What brought you joy today?",
  "Describe a challenge you faced and how you handled it.",
  "What are you grateful for right now?",
  "Write about something you learned recently.",
  "What is one small step you can take towards a goal tomorrow?",
  "How did you practice self-care today?",
  "Describe a moment when you felt proud of yourself.",
  "What's been on your mind lately?",
  "If you could tell your younger self one thing, what would it be?",
  "What are you looking forward to?",
  "Reflect on a recent conversation that stuck with you.",
  "What does 'peace' mean to you today?",
  "Describe a simple pleasure you enjoyed recently.",
  "What is a strength you possess that you appreciate?",
  "Write a letter to someone (you don't have to send it)."
];

export const MOOD_OPTIONS: MoodOption[] = [
  { level: MoodLevel.AWFUL, emoji: '😢', label: 'Awful' },
  { level: MoodLevel.BAD, emoji: '😟', label: 'Bad' },
  { level: MoodLevel.NEUTRAL, emoji: '😐', label: 'Neutral' },
  { level: MoodLevel.GOOD, emoji: '😊', label: 'Good' },
  { level: MoodLevel.GREAT, emoji: '🤩', label: 'Great' },
];

export const BACKUP_REMINDER_INTERVAL_DAYS = 7; // Remind every 7 days
    