/**
 * Formats the given time in seconds into a mm:ss format
 * @param {number} seconds - The time in seconds to be formatted
 * @returns {string} - The formatted time in mm:ss format
 */
export const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export function formatDateTime(isoString) {
    const date = new Date(isoString);
    
    const dateStr = date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    })
      .replace(':00', '')
      .toUpperCase();
  
    return `${dateStr}, ${timeStr}`;
  }

  export const timeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    
    return 'just now';
  };

  // New function to format time for chat messages
  export const formatChatTime = (time) => {
    const date = new Date(time);
    const now = new Date();
    
    // Check if the date is today
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    // Check if the date is yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    // Check if the date is within the last week
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);
    if (date >= oneWeekAgo) {
        return date.toLocaleString('en-US', { weekday: 'long' }); // e.g., "Tuesday"
    }

    // For dates older than a week, return the date in dd/mm/yyyy format
    return date.toLocaleDateString('en-GB'); // e.g., "26/01/2025"
  }; 