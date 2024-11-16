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
