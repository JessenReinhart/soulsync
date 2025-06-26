import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { JournalEntry, AppSettings, Theme, AppData } from '../types';
import { LOCAL_STORAGE_APP_DATA_KEY } from '../constants';

const getInitialSystemTheme = (): Theme => {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const initialSettings: AppSettings = {
  theme: getInitialSystemTheme(),
  userName: '',
  lastBackupReminderDismissedTs: undefined,
  showPrompts: true,
};

const initialState: AppData = {
  entries: [],
  settings: initialSettings,
};

interface StoreState extends AppData {}

interface StoreActions {
  addEntry: (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  updateEntry: (entry: JournalEntry) => void;
  deleteEntry: (id: string) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setUserName: (name: string) => void;
  dismissBackupReminder: () => void;
  togglePrompts: (show: boolean) => void;
  importAppState: (data: AppData) => void;
  getAppState: () => AppData;
}

export const useAppStore = create<StoreState & StoreActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addEntry: (entryData) => set(produce((draft: StoreState) => {
        const newEntry: JournalEntry = {
          ...entryData,
          id: entryData.id || crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        draft.entries.push(newEntry);
        draft.entries.sort((a,b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime() || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      })),

      updateEntry: (entry) => set(produce((draft: StoreState) => {
        const index = draft.entries.findIndex(e => e.id === entry.id);
        if (index !== -1) {
          draft.entries[index] = { ...entry, updatedAt: new Date().toISOString() };
          draft.entries.sort((a,b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime() || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
      })),

      deleteEntry: (id) => set(produce((draft: StoreState) => {
        draft.entries = draft.entries.filter(e => e.id !== id);
      })),

      setTheme: (newTheme) => set(produce((draft: StoreState) => {
        draft.settings.theme = newTheme;
      })),

      toggleTheme: () => set(produce((draft: StoreState) => {
        draft.settings.theme = draft.settings.theme === 'light' ? 'dark' : 'light';
      })),

      setUserName: (name) => set(produce((draft: StoreState) => {
        draft.settings.userName = name;
      })),

      dismissBackupReminder: () => set(produce((draft: StoreState) => {
        draft.settings.lastBackupReminderDismissedTs = Date.now();
      })),

      togglePrompts: (show) => set(produce((draft: StoreState) => {
        draft.settings.showPrompts = show;
      })),
      
      importAppState: (data: AppData) => set(produce((draft: StoreState) => {
        draft.entries = data.entries || [];
        
        // Treat settings from file as potentially partial or missing.
        // Cast to Partial<AppSettings> for safe property access.
        const importedSettingsSource = data.settings || {};
        const importedSettings = importedSettingsSource as Partial<AppSettings>;

        draft.settings = {
          ...initialSettings,    // Load all defaults first.
          ...importedSettings,   // Override with properties from importedSettings if they exist.
                                 // This handles optional fields like userName and lastBackupReminderDismissedTs.
          
          // Explicitly validate and set 'theme', falling back to a default.
          theme: (importedSettings.theme === 'light' || importedSettings.theme === 'dark')
                 ? importedSettings.theme
                 : getInitialSystemTheme(),
          
          // Explicitly validate and set 'showPrompts', falling back to a default.
          showPrompts: typeof importedSettings.showPrompts === 'boolean'
                       ? importedSettings.showPrompts
                       : initialSettings.showPrompts,
        };
      })),

      getAppState: () => {
        return {
          entries: get().entries,
          settings: get().settings,
        };
      }
    }),
    {
      name: LOCAL_STORAGE_APP_DATA_KEY,
      storage: createJSONStorage(() => localStorage),
      // No explicit onRehydrateStorage needed for theme, App.tsx will handle it.
    }
  )
);

// Function to apply theme to DOM, to be called from App.tsx effect
export const applyThemeToDOM = (theme: Theme) => {
  if (typeof window !== 'undefined') {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
};

// Initialize theme on first load (e.g. if App.tsx hasn't mounted yet or for non-React parts)
// This is best handled by an effect in App.tsx to ensure React lifecycle.
// However, Zustand's persist middleware will load the theme, and App.tsx effect will apply it.
// One initial call from App.tsx is sufficient.