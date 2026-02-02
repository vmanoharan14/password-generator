/**
 * Calculates password strength based on actual entropy calculation
 * @param {number} length - Password length
 * @param {Object} options - Character type options
 * @param {boolean} options.uppercase - Include uppercase letters
 * @param {boolean} options.lowercase - Include lowercase letters
 * @param {boolean} options.numbers - Include numbers
 * @param {boolean} options.special - Include special characters
 * @returns {Object} Strength info with level, label, entropy bits, and color
 */
export function calculateStrength(length, options) {
  // Calculate charset size based on selected options
  let charsetSize = 0;
  if (options.uppercase) charsetSize += 26;
  if (options.lowercase) charsetSize += 26;
  if (options.numbers) charsetSize += 10;
  if (options.special) charsetSize += 26; // Updated to match new special char set

  // Calculate Shannon entropy: H = L * log2(N)
  // where L = password length, N = charset size
  const entropy = length * Math.log2(charsetSize);

  // Determine strength level based on entropy bits
  // Standards based on NIST and industry best practices:
  // - < 28 bits: Very weak (crackable in seconds)
  // - 28-35 bits: Weak (crackable in minutes)
  // - 36-59 bits: Fair (crackable in hours/days)
  // - 60-80 bits: Good (crackable in months)
  // - 80-128 bits: Strong (practically uncrackable)
  // - > 128 bits: Very strong (future-proof)
  
  if (entropy < 28) {
    return { 
      level: 1, 
      label: 'Very Weak', 
      entropy: Math.round(entropy),
      color: '#dc2626' // red-600
    };
  }

  if (entropy < 36) {
    return { 
      level: 2, 
      label: 'Weak', 
      entropy: Math.round(entropy),
      color: '#ef4444' // red-500
    };
  }

  if (entropy < 60) {
    return { 
      level: 3, 
      label: 'Fair', 
      entropy: Math.round(entropy),
      color: '#f97316' // orange-500
    };
  }

  if (entropy < 80) {
    return { 
      level: 4, 
      label: 'Good', 
      entropy: Math.round(entropy),
      color: '#eab308' // yellow-500
    };
  }

  if (entropy < 128) {
    return { 
      level: 5, 
      label: 'Strong', 
      entropy: Math.round(entropy),
      color: '#22c55e' // green-500
    };
  }

  return { 
    level: 6, 
    label: 'Very Strong', 
    entropy: Math.round(entropy),
    color: '#16a34a' // green-600
  };
}
