import { describe, it, expect } from 'vitest';
import { generatePassword, CHAR_SETS } from './generatePassword';

describe('generatePassword', () => {
  describe('Password Length', () => {
    it('should generate password with correct length for Short preset (8)', () => {
      const password = generatePassword(8, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(password).toHaveLength(8);
    });

    it('should generate password with correct length for Medium preset (12)', () => {
      const password = generatePassword(12, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(password).toHaveLength(12);
    });

    it('should generate password with correct length for Strong preset (16)', () => {
      const password = generatePassword(16, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(password).toHaveLength(16);
    });

    it('should generate password with correct length for Maximum preset (32)', () => {
      const password = generatePassword(32, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(password).toHaveLength(32);
    });
  });

  describe('Character Types', () => {
    it('should include only uppercase letters when only uppercase is enabled', () => {
      const password = generatePassword(20, {
        uppercase: true,
        lowercase: false,
        numbers: false,
        special: false,
      });
      expect(password).toMatch(/^[A-Z]+$/);
    });

    it('should include only lowercase letters when only lowercase is enabled', () => {
      const password = generatePassword(20, {
        uppercase: false,
        lowercase: true,
        numbers: false,
        special: false,
      });
      expect(password).toMatch(/^[a-z]+$/);
    });

    it('should include only numbers when only numbers is enabled', () => {
      const password = generatePassword(20, {
        uppercase: false,
        lowercase: false,
        numbers: true,
        special: false,
      });
      expect(password).toMatch(/^[0-9]+$/);
    });

    it('should include only special characters when only special is enabled', () => {
      const password = generatePassword(20, {
        uppercase: false,
        lowercase: false,
        numbers: false,
        special: true,
      });
      expect(password).toMatch(/^[\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\|\;\:\,\.\<\>\?]+$/);
    });

    it('should include alphanumeric characters when uppercase, lowercase, and numbers enabled', () => {
      const password = generatePassword(50, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: false,
      });
      expect(password).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should include all character types when all options enabled', () => {
      const password = generatePassword(100, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      // Password should only contain valid characters
      expect(password).toMatch(/^[A-Za-z0-9\!\@\#\$\%\^\&\*\(\)\_\+\-\=\[\]\{\}\|\;\:\,\.\<\>\?]+$/);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when no character types are selected', () => {
      expect(() =>
        generatePassword(16, {
          uppercase: false,
          lowercase: false,
          numbers: false,
          special: false,
        })
      ).toThrow('At least one character type must be selected');
    });

    it('should throw error when length is less than 1', () => {
      expect(() =>
        generatePassword(0, {
          uppercase: true,
          lowercase: false,
          numbers: false,
          special: false,
        })
      ).toThrow('Length must be between 1 and 128');
    });

    it('should throw error when length is greater than 128', () => {
      expect(() =>
        generatePassword(129, {
          uppercase: true,
          lowercase: false,
          numbers: false,
          special: false,
        })
      ).toThrow('Length must be between 1 and 128');
    });

    it('should throw error when length is not an integer', () => {
      expect(() =>
        generatePassword(10.5, {
          uppercase: true,
          lowercase: false,
          numbers: false,
          special: false,
        })
      ).toThrow('Length must be an integer');
    });

    it('should throw error when length is negative', () => {
      expect(() =>
        generatePassword(-5, {
          uppercase: true,
          lowercase: false,
          numbers: false,
          special: false,
        })
      ).toThrow('Length must be between 1 and 128');
    });
  });

  describe('Randomness', () => {
    it('should generate different passwords on consecutive calls', () => {
      const options = {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      };
      const password1 = generatePassword(16, options);
      const password2 = generatePassword(16, options);
      const password3 = generatePassword(16, options);

      // While theoretically possible to get same password, extremely unlikely with 16 chars
      const allSame = password1 === password2 && password2 === password3;
      expect(allSame).toBe(false);
    });

    it('should produce uniform distribution (statistical test)', () => {
      const options = {
        uppercase: false,
        lowercase: false,
        numbers: true, // Only 10 digits for easier distribution check
        special: false,
      };

      const counts = {};
      for (let i = 0; i < 1000; i++) {
        const password = generatePassword(10, options);
        for (const char of password) {
          counts[char] = (counts[char] || 0) + 1;
        }
      }

      // Each digit should appear roughly 1000 times (10000 chars / 10 digits)
      // Allow 30% variance for randomness
      const expected = 1000;
      const tolerance = 0.3;

      for (const digit of '0123456789') {
        const count = counts[digit] || 0;
        expect(count).toBeGreaterThan(expected * (1 - tolerance));
        expect(count).toBeLessThan(expected * (1 + tolerance));
      }
    });
  });

  describe('Character Sets', () => {
    it('should have correct uppercase character set', () => {
      expect(CHAR_SETS.uppercase).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      expect(CHAR_SETS.uppercase).toHaveLength(26);
    });

    it('should have correct lowercase character set', () => {
      expect(CHAR_SETS.lowercase).toBe('abcdefghijklmnopqrstuvwxyz');
      expect(CHAR_SETS.lowercase).toHaveLength(26);
    });

    it('should have correct numbers character set', () => {
      expect(CHAR_SETS.numbers).toBe('0123456789');
      expect(CHAR_SETS.numbers).toHaveLength(10);
    });

    it('should have correct special character set', () => {
      expect(CHAR_SETS.special).toBe('!@#$%^&*()_+-=[]{}|;:,.<>?');
      expect(CHAR_SETS.special).toHaveLength(26);
    });
  });

  describe('Rejection Sampling (Modulo Bias Fix)', () => {
    it('should generate passwords without modulo bias', () => {
      // Generate many passwords and check distribution
      const options = {
        uppercase: false,
        lowercase: false,
        numbers: true,
        special: false,
      };

      const counts = {};
      const iterations = 2000;
      
      for (let i = 0; i < iterations; i++) {
        const password = generatePassword(10, options);
        for (const char of password) {
          counts[char] = (counts[char] || 0) + 1;
        }
      }

      // With rejection sampling, distribution should be uniform
      // Each digit should appear roughly 2000 times (20000 chars / 10 digits)
      const expected = iterations;
      const tolerance = 0.25; // 25% variance allowed

      for (const digit of '0123456789') {
        const count = counts[digit] || 0;
        expect(count).toBeGreaterThan(expected * (1 - tolerance));
        expect(count).toBeLessThan(expected * (1 + tolerance));
      }
    });
  });
});
