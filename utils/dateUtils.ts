// Ensure this function handles string or Date inputs robustly
export const getFormattedDate = (
  dateInput: string | Date | number | null | undefined,
  options?: Intl.DateTimeFormatOptions,
): string => {
  console.log("getFormattedDate called with:", dateInput);
  if (!dateInput) {
    // Handles null, undefined, or empty string
    return "Invalid Date";
  }
  const date = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) {
    // Check if date is valid
    // Try to parse YYYY-MM-DD which sometimes isn't parsed correctly if no time is specified
    // This specific check might be redundant if !dateInput already covers empty strings causing Invalid Date
    if (
      typeof dateInput === "string" &&
      dateInput.match(/^\d{4}-\d{2}-\d{2}$/)
    ) {
      const parts = dateInput.split("-");
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
      const day = parseInt(parts[2], 10);
      const fixedDate = new Date(year, month, day);
      if (!isNaN(fixedDate.getTime())) {
        return fixedDate.toLocaleDateString(
          undefined,
          options || { year: "numeric", month: "long", day: "numeric" },
        );
      }
    }
    return "Invalid Date";
  }
  return date.toLocaleDateString(
    undefined,
    options || { year: "numeric", month: "long", day: "numeric" },
  );
};

// Returns date as YYYY-MM-DD string
export const formatDateISO = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const timeAgo = (
  dateInput: string | Date | null | undefined,
): string => {
  if (!dateInput) {
    // Handles null, undefined, or empty string
    return "some time ago";
  }
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();

  // Check if the date object is valid before calling getTime
  if (isNaN(date.getTime())) {
    return "some time ago";
  }

  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

  // This check is effectively covered by isNaN(date.getTime()) above, but kept for clarity if seconds becomes NaN for other reasons
  if (isNaN(seconds)) return "some time ago";

  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const months = Math.round(days / 30.44); // Average days in month
  const years = Math.round(days / 365.25); // Account for leap years

  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`; // Up to 4 weeks
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
};
