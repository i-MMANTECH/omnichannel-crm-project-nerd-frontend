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