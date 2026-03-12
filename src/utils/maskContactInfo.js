/**
 * Utility function to mask phone numbers for non-admin users
 * @param {string} phoneNumber - The phone number to mask
 * @param {boolean} canView - Whether the user has permission to view the full number
 * @returns {string} - The masked or full phone number
 */
export const maskPhoneNumber = (phoneNumber, canView = false) => {
  if (!phoneNumber) return '';
  
  // If user can view, return the full number
  if (canView) return phoneNumber;
  
  // Mask the phone number, showing only the last 4 digits
  const phoneStr = String(phoneNumber);
  if (phoneStr.length <= 4) {
    return '****';
  }
  
  const lastFour = phoneStr.slice(-4);
  const maskedPart = '*'.repeat(phoneStr.length - 4);
  return `${maskedPart}${lastFour}`;
};

/**
 * Utility function to mask email addresses for non-admin users
 * @param {string} email - The email to mask
 * @param {boolean} canView - Whether the user has permission to view the full email
 * @returns {string} - The masked or full email
 */
export const maskEmail = (email, canView = false) => {
  if (!email) return '';
  
  // If user can view, return the full email
  if (canView) return email;
  
  const [localPart, domain] = email.split('@');
  if (!domain) return email;
  
  // Show first 2 characters of local part and mask the rest
  const visibleChars = Math.min(2, localPart.length);
  const maskedLocal = localPart.slice(0, visibleChars) + '***';
  return `${maskedLocal}@${domain}`;
};

/**
 * Check if user is admin based on roles
 * @param {Array} roles - User roles array
 * @returns {boolean} - Whether user is admin
 */
export const isUserAdmin = (roles) => {
  if (!roles || !Array.isArray(roles)) return false;
  return roles.some(role => 
    role === "Admin" || 
    role === "admin" || 
    (typeof role === 'object' && (role.name === "Admin" || role.name === "admin"))
  );
};