import React, { useState, useRef, useEffect } from 'react';
import Button from '../components/common/Button';
import ToggleSwitch from '../components/common/ToggleSwitch';
import Icon from '../components/common/Icon';
import { AppData } from '../types';
import { exportData, importData } from '../utils/exportImport';
import { BACKUP_REMINDER_INTERVAL_DAYS } from '../constants';
import { useAppStore } from '../store/appStore';

const SettingsPage: React.FC = () => {
  const settings = useAppStore(state => state.settings);
  const theme = useAppStore(state => state.settings.theme);
  const getAppState = useAppStore(state => state.getAppState);
  // setThemeAction is not directly used, toggleTheme is preferred for UI
  const toggleThemeAction = useAppStore(state => state.toggleTheme);
  const setUserNameAction = useAppStore(state => state.setUserName);
  const togglePromptsAction = useAppStore(state => state.togglePrompts);
  const dismissBackupReminderAction = useAppStore(state => state.dismissBackupReminder);
  const importAppStateAction = useAppStore(state => state.importAppState);
  
  const [userNameInput, setUserNameInput] = useState(settings.userName || '');
  const [showPromptsInput, setShowPromptsInput] = useState(settings.showPrompts);
  const [importMessage, setImportMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUserNameInput(settings.userName || '');
    setShowPromptsInput(settings.showPrompts);
  }, [settings.userName, settings.showPrompts]);


  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserNameInput(e.target.value);
  };

  const saveUserName = () => {
    setUserNameAction(userNameInput);
    // Consider a less intrusive success message, e.g., a temporary toast or inline text
    alert("User name updated!"); 
  };

  const handleTogglePrompts = () => {
    const newShowPrompts = !showPromptsInput;
    setShowPromptsInput(newShowPrompts);
    togglePromptsAction(newShowPrompts);
  }

  const handleExport = () => {
    const currentAppState = getAppState();
    exportData(currentAppState);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setImportMessage(null);
    const file = event.target.files?.[0];
    if (file) {
      try {
        const imported = await importData(file);
        importAppStateAction(imported);
        setImportMessage({type: 'success', text: 'Data imported successfully! Your settings and entries have been updated.'});
      } catch (error) {
        console.error("Import failed:", error);
        setImportMessage({type: 'error', text: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}. Please ensure the file is a valid SoulSync JSON export.`});
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };
  
  const showBackupReminder = (): boolean => {
    if (!settings.lastBackupReminderDismissedTs) return true; // Show if never dismissed
    const daysSinceDismissed = (Date.now() - settings.lastBackupReminderDismissedTs) / (1000 * 60 * 60 * 24);
    return daysSinceDismissed > BACKUP_REMINDER_INTERVAL_DAYS;
  };
  
  const dismissReminder = () => {
    dismissBackupReminderAction();
  }

  const sectionStyle = "bg-cardLight dark:bg-cardDark p-6 rounded-xl shadow-soft-lg";
  const inputStyle = "focus:ring-primaryDark dark:focus:ring-primaryLight focus:border-primaryDark dark:focus:border-primaryLight flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-primaryLight/50 dark:border-primaryDark/40 bg-cardLight dark:bg-cardDark px-3 py-2 text-textLight dark:text-textDark placeholder-textLight/60 dark:placeholder-textDark/60";


  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Title is now part of the App shell */}

      {showBackupReminder() && (
        <div className="bg-secondaryLight/30 dark:bg-secondaryDark/20 border-l-4 border-secondaryDark dark:border-secondaryLight text-secondaryDark dark:text-secondaryLight/90 p-4 rounded-md shadow-soft-md" role="alert">
          <div className="flex">
            <div className="py-1"><Icon name="upload" className="mr-3" size={20}/></div>
            <div>
              <p className="font-bold">Friendly Reminder!</p>
              <p className="text-sm">It's good practice to back up your journal data periodically. You can export your data below.</p>
              <Button variant="ghost" size="sm" onClick={dismissReminder} className="mt-2 text-secondaryDark dark:text-secondaryLight/90 border-secondaryDark/50 dark:border-secondaryLight/50 hover:bg-secondaryLight/50 dark:hover:bg-secondaryDark/30">
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      <section className={sectionStyle}>
        <h2 className="text-xl font-semibold mb-4 text-textLight dark:text-textDark">Appearance & Preferences</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-textLight dark:text-textDark">Dark Mode</span>
            <ToggleSwitch
              isOn={theme === 'dark'}
              onToggle={toggleThemeAction}
              onIcon={<Icon name="moon" size={16} className="text-primaryDark" />}
              offIcon={<Icon name="sun" size={16} className="text-secondaryDark" />}
            />
          </div>
           <div className="flex justify-between items-center">
            <span className="text-textLight dark:text-textDark">Show Daily Writing Prompts</span>
            <ToggleSwitch
              isOn={showPromptsInput}
              onToggle={handleTogglePrompts}
            />
          </div>
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-textLight dark:text-textDark">
              Your Name (Optional)
            </label>
            <div className="mt-1 flex rounded-md shadow-soft-sm">
              <input
                type="text"
                name="userName"
                id="userName"
                value={userNameInput}
                onChange={handleUserNameChange}
                className={inputStyle}
                placeholder="How you'd like to be greeted"
              />
              <Button
                onClick={saveUserName}
                variant="primary"
                type="button"
                className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-primaryDark bg-primaryDark text-white sm:text-sm hover:bg-opacity-85"
              >
                Save
              </Button>
            </div>
            <p className="mt-1 text-xs text-textLight/70 dark:text-textDark/70">This is just for a personal touch, it's not used elsewhere.</p>
          </div>
        </div>
      </section>

      <section className={sectionStyle}>
        <h2 className="text-xl font-semibold mb-4 text-textLight dark:text-textDark">Data Management</h2>
        <p className="text-sm text-textLight dark:text-textDark opacity-90 mb-4">
          Your journal data is stored locally in your browser. Export it for backup or to move to another device.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleExport} variant="primary" type="button" className="w-full sm:w-auto" leftIcon={<Icon name="download" size={18}/>}>
            Export Data (JSON)
          </Button>
          <Button onClick={handleImportClick} variant="secondary" type="button" className="w-full sm:w-auto" leftIcon={<Icon name="upload" size={18}/>}>
            Import Data (JSON)
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".json"
            className="hidden"
          />
        </div>
        {importMessage && (
            <p className={`mt-4 text-sm ${importMessage.type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {importMessage.text}
            </p>
        )}
      </section>
      
      <section className={sectionStyle}>
        <h2 className="text-xl font-semibold mb-4 text-textLight dark:text-textDark">About SoulSync</h2>
        <p className="text-sm text-textLight dark:text-textDark opacity-90">
          SoulSync is your personal space for reflection and understanding. We believe in the power of journaling and mood tracking to foster self-awareness and well-being.
        </p>
        <p className="text-xs text-textLight/70 dark:text-textDark/70 mt-4">Version 1.1.0 (Pastel Dreams Update)</p>
      </section>
    </div>
  );
};

export default SettingsPage;