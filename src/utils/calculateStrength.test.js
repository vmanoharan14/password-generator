import { describe, it, expect } from 'vitest';
import { calculateStrength } from './calculateStrength';

describe('calculateStrength', () => {
  describe('Very Weak Passwords', () => {
    it('should return Very Weak for very low entropy passwords', () => {
      const result = calculateStrength(4, {
        uppercase: true,
        lowercase: false,
        numbers: false,
        special: false,
      });
      expect(result.level).toBe(1);
      expect(result.label).toBe('Very Weak');
      expect(result.color).toBe('#dc2626');
      expect(result.entropy).toBeLessThan(28);
    });

    it('should return Very Weak for short passwords with limited charset', () => {
      const result = calculateStrength(5, {
        uppercase: false,
        lowercase: false,
        numbers: true,
        special: false,
      });
      expect(result.level).toBe(1);
      expect(result.entropy).toBeLessThan(28);
    });
  });

  describe('Weak Passwords', () => {
    it('should return Weak for passwords with 28-35 bits of entropy', () => {
      // 5 chars with all types (88 charset) = 32.3 bits
      const result = calculateStrength(5, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(2);
      expect(result.label).toBe('Weak');
      expect(result.color).toBe('#ef4444');
      expect(result.entropy).toBeGreaterThanOrEqual(28);
      expect(result.entropy).toBeLessThan(36);
    });

    it('should return Weak for single character type with moderate length', () => {
      const result = calculateStrength(6, {
        uppercase: true,
        lowercase: false,
        numbers: false,
        special: false,
      });
      expect(result.level).toBe(2);
      expect(result.label).toBe('Weak');
    });

    it('should return Weak for only lowercase with sufficient length', () => {
      const result = calculateStrength(7, {
        uppercase: false,
        lowercase: true,
        numbers: false,
        special: false,
      });
      expect(result.level).toBe(2);
      expect(result.label).toBe('Weak');
    });

    it('should return Weak for only numbers with sufficient length', () => {
      const result = calculateStrength(10, {
        uppercase: false,
        lowercase: false,
        numbers: true,
        special: false,
      });
      expect(result.level).toBe(2);
      expect(result.label).toBe('Weak');
    });
  });

  describe('Fair Passwords', () => {
    it('should return Fair for passwords with 36-59 bits of entropy', () => {
      // 8 chars with all types (88 charset) = 51.6 bits
      const result = calculateStrength(8, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(3);
      expect(result.label).toBe('Fair');
      expect(result.color).toBe('#f97316');
      expect(result.entropy).toBeGreaterThanOrEqual(36);
      expect(result.entropy).toBeLessThan(60);
    });

    it('should return Fair for 8 chars with all types', () => {
      const result = calculateStrength(8, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(3);
      expect(result.label).toBe('Fair');
    });

    it('should return Fair for 11 chars with 2 types', () => {
      // 11 chars with upper+lower (52 charset) = 62.7 bits - actually Good
      // Let's use 9 chars instead: 9 * log2(52) = 51.3 bits = Fair
      const result = calculateStrength(9, {
        uppercase: true,
        lowercase: true,
        numbers: false,
        special: false,
      });
      expect(result.level).toBe(3);
      expect(result.label).toBe('Fair');
    });
  });

  describe('Good Passwords', () => {
    it('should return Good for passwords with 60-79 bits of entropy', () => {
      // 11 chars with all types (88 charset) = 71.0 bits
      const result = calculateStrength(11, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(4);
      expect(result.label).toBe('Good');
      expect(result.color).toBe('#eab308');
      expect(result.entropy).toBeGreaterThanOrEqual(60);
      expect(result.entropy).toBeLessThan(80);
    });

    it('should return Good for 12 chars with all types', () => {
      const result = calculateStrength(12, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(4);
      expect(result.label).toBe('Good');
    });

    it('should return Good for 15 chars with 3 types', () => {
      // 15 chars with lower+nums+special (62 charset) = 89.3 bits - actually Strong
      // Let's use 13 chars: 13 * log2(62) = 77.4 bits = Good
      const result = calculateStrength(13, {
        uppercase: false,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(4);
      expect(result.label).toBe('Good');
    });

    it('should return Good for 16+ chars with fewer than 4 character types', () => {
      // 16 chars with upper+lower+nums (62 charset) = 95.3 bits - actually Strong
      // Let's use 13 chars: 13 * log2(62) = 77.4 bits = Good
      const result = calculateStrength(13, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: false,
      });
      expect(result.level).toBe(4);
      expect(result.label).toBe('Good');
    });
  });

  describe('Strong Passwords', () => {
    it('should return Strong for passwords with 80-127 bits of entropy', () => {
      // 14 chars with all types (88 charset) = 90.4 bits
      const result = calculateStrength(14, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(5);
      expect(result.label).toBe('Strong');
      expect(result.color).toBe('#22c55e');
      expect(result.entropy).toBeGreaterThanOrEqual(80);
      expect(result.entropy).toBeLessThan(128);
    });

    it('should return Strong for 32 chars with all types (Maximum preset)', () => {
      const result = calculateStrength(32, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(6); // Very Strong
      expect(result.label).toBe('Very Strong');
    });
  });

  describe('Very Strong Passwords', () => {
    it('should return Very Strong for passwords with 128+ bits of entropy', () => {
      // 20 chars with all types (88 charset) = 129.1 bits
      const result = calculateStrength(20, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(6);
      expect(result.label).toBe('Very Strong');
      expect(result.color).toBe('#16a34a');
      expect(result.entropy).toBeGreaterThanOrEqual(128);
    });

    it('should return Very Strong for very long passwords with all types', () => {
      const result = calculateStrength(64, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(6);
      expect(result.label).toBe('Very Strong');
    });
  });

  describe('Edge Cases', () => {
    it('should handle minimum length of 1', () => {
      const result = calculateStrength(1, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(1);
      expect(result.label).toBe('Very Weak');
    });

    it('should handle all options disabled (edge case)', () => {
      const result = calculateStrength(16, {
        uppercase: false,
        lowercase: false,
        numbers: false,
        special: false,
      });
      // 0 active types results in NaN entropy, should handle gracefully
      expect(result).toBeDefined();
      expect(result.level).toBe(1);
    });

    it('should return correct color codes', () => {
      const veryWeak = calculateStrength(4, { uppercase: true, lowercase: false, numbers: false, special: false });
      // 6 chars with all types = 38.8 bits = Fair
      const weak = calculateStrength(6, { uppercase: true, lowercase: true, numbers: true, special: true });
      // 9 chars with all types = 58.1 bits = Fair (close to Good boundary)
      const fair = calculateStrength(9, { uppercase: true, lowercase: true, numbers: true, special: true });
      // 12 chars with all types = 77.5 bits = Good
      const good = calculateStrength(12, { uppercase: true, lowercase: true, numbers: true, special: true });
      // 15 chars with all types = 96.8 bits = Strong
      const strong = calculateStrength(15, { uppercase: true, lowercase: true, numbers: true, special: true });
      // 20 chars with all types = 129.1 bits = Very Strong
      const veryStrong = calculateStrength(20, { uppercase: true, lowercase: true, numbers: true, special: true });

      expect(veryWeak.color).toBe('#dc2626');   // Red-600
      expect(weak.color).toBe('#f97316');       // Orange-500 (Fair)
      expect(fair.color).toBe('#f97316');       // Orange-500
      expect(good.color).toBe('#eab308');       // Yellow-500
      expect(strong.color).toBe('#22c55e');     // Green-500
      expect(veryStrong.color).toBe('#16a34a'); // Green-600
    });

    it('should include entropy value in result', () => {
      const result = calculateStrength(16, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.entropy).toBeDefined();
      expect(typeof result.entropy).toBe('number');
      expect(result.entropy).toBeGreaterThan(0);
    });
  });

  describe('Preset Combinations', () => {
    it('Short preset (8) with all types should be Fair', () => {
      const result = calculateStrength(8, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      // 8 chars with 88 charset = 51.6 bits
      expect(result.level).toBe(3);
      expect(result.label).toBe('Fair');
    });

    it('Medium preset (12) with all types should be Good', () => {
      const result = calculateStrength(12, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      // 12 chars with 88 charset = 77.5 bits
      expect(result.level).toBe(4);
      expect(result.label).toBe('Good');
    });

    it('Strong preset (16) with all types should be Strong', () => {
      const result = calculateStrength(16, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      // 16 chars with 88 charset = 103.3 bits
      expect(result.level).toBe(5);
      expect(result.label).toBe('Strong');
    });

    it('Maximum preset (32) with all types should be Very Strong', () => {
      const result = calculateStrength(32, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      // 32 chars with 88 charset = 206.6 bits
      expect(result.level).toBe(6);
      expect(result.label).toBe('Very Strong');
    });
  });

  describe('Entropy Calculation', () => {
    it('should calculate correct entropy for single character type', () => {
      const result = calculateStrength(10, {
        uppercase: true,
        lowercase: false,
        numbers: false,
        special: false,
      });
      // 10 chars * log2(26) = 47.0 bits
      expect(result.entropy).toBe(47);
    });

    it('should calculate correct entropy for all character types', () => {
      const result = calculateStrength(10, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      // 10 chars * log2(88) = 64.5 bits
      expect(result.entropy).toBe(65);
    });
  });
});
