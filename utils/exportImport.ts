
import { AppData } from '../types';
import { APP_NAME } from '../constants';

export const exportData = (data: AppData): void => {
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  link.download = `${APP_NAME.toLowerCase()}_backup_${timestamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<AppData> => {
  return new Promise((resolve, reject) => {
    if (file.type !== 'application/json') {
      reject(new Error("Invalid file type. Please select a JSON file."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const parsedData = JSON.parse(jsonString) as AppData;
        
        // Basic validation of the imported data structure
        if (!parsedData || typeof parsedData !== 'object' || !Array.isArray(parsedData.entries) || typeof parsedData.settings !== 'object') {
            throw new Error("Invalid data structure in JSON file.");
        }
        // Further validation can be added here (e.g., check entry fields)

        resolve(parsedData);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
        reject(new Error(`Could not parse JSON file. ${error instanceof Error ? error.message : ''}`));
      }
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      reject(new Error("Could not read the file."));
    };
    reader.readAsText(file);
  });
};
    