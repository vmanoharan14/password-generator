const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  special: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

/**
 * Gets a random character from charset using rejection sampling to eliminate modulo bias
 * @param {string} charset - Character set to select from
 * @returns {string} Random character
 */
function getRandomChar(charset) {
  const charsetLength = charset.length;
  // Calculate the maximum valid value to avoid modulo bias
  // We reject values in the range [maxValid, 2^32) to ensure uniform distribution
  const maxValid = Math.floor(0xFFFFFFFF / charsetLength) * charsetLength;
  
  let randomValue;
  const array = new Uint32Array(1);
  
  do {
    crypto.getRandomValues(array);
    randomValue = array[0];
  } while (randomValue >= maxValid);
  
  return charset[randomValue % charsetLength];
}

/**
 * Generates a cryptographically secure random password
 * @param {number} length - Password length (1-128)
 * @param {Object} options - Character type options
 * @param {boolean} options.uppercase - Include uppercase letters
 * @param {boolean} options.lowercase - Include lowercase letters
 * @param {boolean} options.numbers - Include numbers
 * @param {boolean} options.special - Include special characters
 * @returns {string} Generated password
 */
export function generatePassword(length, options) {
  // Input validation
  if (!Number.isInteger(length)) {
    throw new Error('Length must be an integer');
  }
  if (length < 1 || length > 128) {
    throw new Error('Length must be between 1 and 128');
  }
  
  const { uppercase, lowercase, numbers, special } = options;

  let charset = '';
  if (uppercase) charset += CHAR_SETS.uppercase;
  if (lowercase) charset += CHAR_SETS.lowercase;
  if (numbers) charset += CHAR_SETS.numbers;
  if (special) charset += CHAR_SETS.special;

  if (charset.length === 0) {
    throw new Error('At least one character type must be selected');
  }

  let password = '';
  for (let i = 0; i < length; i++) {
    password += getRandomChar(charset);
  }

  return password;
}

export { CHAR_SETS };
