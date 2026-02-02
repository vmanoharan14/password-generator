/**
 * Calculates password strength based on length and character variety
 * @param {number} length - Password length
 * @param {Object} options - Character type options
 * @returns {Object} Strength info with level and label
 */
export function calculateStrength(length, options) {
  const activeTypes = Object.values(options).filter(Boolean).length;

  // Determine strength level
  if (length < 8 || activeTypes === 1) {
    return { level: 1, label: 'Weak', color: '#ef4444' };
  }

  if (length <= 11 && activeTypes >= 2) {
    return { level: 2, label: 'Fair', color: '#f97316' };
  }

  if (length <= 15 && activeTypes >= 3) {
    return { level: 3, label: 'Good', color: '#eab308' };
  }

  if (length >= 16 && activeTypes === 4) {
    return { level: 4, label: 'Strong', color: '#22c55e' };
  }

  // Default to Good for longer passwords with fewer character types
  if (length >= 12) {
    return { level: 3, label: 'Good', color: '#eab308' };
  }

  return { level: 2, label: 'Fair', color: '#f97316' };
}
