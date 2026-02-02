const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  special: '!@#$%^&*',
};

/**
 * Generates a cryptographically secure random password
 * @param {number} length - Password length
 * @param {Object} options - Character type options
 * @param {boolean} options.uppercase - Include uppercase letters
 * @param {boolean} options.lowercase - Include lowercase letters
 * @param {boolean} options.numbers - Include numbers
 * @param {boolean} options.special - Include special characters
 * @returns {string} Generated password
 */
export function generatePassword(length, options) {
  const { uppercase, lowercase, numbers, special } = options;

  let charset = '';
  if (uppercase) charset += CHAR_SETS.uppercase;
  if (lowercase) charset += CHAR_SETS.lowercase;
  if (numbers) charset += CHAR_SETS.numbers;
  if (special) charset += CHAR_SETS.special;

  if (charset.length === 0) {
    throw new Error('At least one character type must be selected');
  }

  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }

  return password;
}

export { CHAR_SETS };
