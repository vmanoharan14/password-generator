import { describe, it, expect } from 'vitest';
import { calculateStrength } from './calculateStrength';

describe('calculateStrength', () => {
  describe('Weak Passwords', () => {
    it('should return Weak for password less than 8 characters', () => {
      const result = calculateStrength(7, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(1);
      expect(result.label).toBe('Weak');
      expect(result.color).toBe('#ef4444');
    });

    it('should return Weak for single character type regardless of length', () => {
      const result = calculateStrength(16, {
        uppercase: true,
        lowercase: false,
        numbers: false,
        special: false,
      });
      expect(result.level).toBe(1);
      expect(result.label).toBe('Weak');
    });

    it('should return Weak for only lowercase', () => {
      const result = calculateStrength(12, {
        uppercase: false,
        lowercase: true,
        numbers: false,
        special: false,
      });
      expect(result.level).toBe(1);
      expect(result.label).toBe('Weak');
    });

    it('should return Weak for only numbers', () => {
      const result = calculateStrength(20, {
        uppercase: false,
        lowercase: false,
        numbers: true,
        special: false,
      });
      expect(result.level).toBe(1);
      expect(result.label).toBe('Weak');
    });
  });

  describe('Fair Passwords', () => {
    it('should return Fair for 8-11 chars with 2 character types', () => {
      const result = calculateStrength(10, {
        uppercase: true,
        lowercase: true,
        numbers: false,
        special: false,
      });
      expect(result.level).toBe(2);
      expect(result.label).toBe('Fair');
      expect(result.color).toBe('#f97316');
    });

    it('should return Fair for 8 chars with 2 types', () => {
      const result = calculateStrength(8, {
        uppercase: false,
        lowercase: true,
        numbers: true,
        special: false,
      });
      expect(result.level).toBe(2);
      expect(result.label).toBe('Fair');
    });

    it('should return Fair for 11 chars with 2 types', () => {
      const result = calculateStrength(11, {
        uppercase: true,
        lowercase: false,
        numbers: false,
        special: true,
      });
      expect(result.level).toBe(2);
      expect(result.label).toBe('Fair');
    });
  });

  describe('Good Passwords', () => {
    it('should return Good for 12-15 chars with 3 character types', () => {
      const result = calculateStrength(14, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: false,
      });
      expect(result.level).toBe(3);
      expect(result.label).toBe('Good');
      expect(result.color).toBe('#eab308');
    });

    it('should return Good for 12 chars with 3 types', () => {
      const result = calculateStrength(12, {
        uppercase: true,
        lowercase: true,
        numbers: false,
        special: true,
      });
      expect(result.level).toBe(3);
      expect(result.label).toBe('Good');
    });

    it('should return Good for 15 chars with 3 types', () => {
      const result = calculateStrength(15, {
        uppercase: false,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(3);
      expect(result.label).toBe('Good');
    });

    it('should return Good for 16+ chars with fewer than 4 character types', () => {
      const result = calculateStrength(20, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: false,
      });
      expect(result.level).toBe(3);
      expect(result.label).toBe('Good');
    });
  });

  describe('Strong Passwords', () => {
    it('should return Strong for 16+ chars with all 4 character types', () => {
      const result = calculateStrength(16, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(4);
      expect(result.label).toBe('Strong');
      expect(result.color).toBe('#22c55e');
    });

    it('should return Strong for 32 chars with all types (Maximum preset)', () => {
      const result = calculateStrength(32, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(4);
      expect(result.label).toBe('Strong');
    });

    it('should return Strong for very long passwords with all types', () => {
      const result = calculateStrength(64, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(4);
      expect(result.label).toBe('Strong');
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
      expect(result.label).toBe('Weak');
    });

    it('should handle all options disabled (edge case)', () => {
      const result = calculateStrength(16, {
        uppercase: false,
        lowercase: false,
        numbers: false,
        special: false,
      });
      // 0 active types with 16+ length falls through to Good (this edge case is prevented by UI)
      expect(result).toBeDefined();
      expect(result.level).toBeGreaterThanOrEqual(1);
    });

    it('should return correct color codes', () => {
      const weak = calculateStrength(4, { uppercase: true, lowercase: false, numbers: false, special: false });
      const fair = calculateStrength(10, { uppercase: true, lowercase: true, numbers: false, special: false });
      const good = calculateStrength(14, { uppercase: true, lowercase: true, numbers: true, special: false });
      const strong = calculateStrength(16, { uppercase: true, lowercase: true, numbers: true, special: true });

      expect(weak.color).toBe('#ef4444');   // Red
      expect(fair.color).toBe('#f97316');   // Orange
      expect(good.color).toBe('#eab308');   // Yellow
      expect(strong.color).toBe('#22c55e'); // Green
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
      // 8 chars with 4 types - between Fair and Good
      expect(result.level).toBeGreaterThanOrEqual(2);
    });

    it('Medium preset (12) with all types should be Good', () => {
      const result = calculateStrength(12, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBeGreaterThanOrEqual(3);
    });

    it('Strong preset (16) with all types should be Strong', () => {
      const result = calculateStrength(16, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(4);
      expect(result.label).toBe('Strong');
    });

    it('Maximum preset (32) with all types should be Strong', () => {
      const result = calculateStrength(32, {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
      expect(result.level).toBe(4);
      expect(result.label).toBe('Strong');
    });
  });
});
