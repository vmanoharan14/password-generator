import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePasswordGenerator } from './usePasswordGenerator';

describe('usePasswordGenerator', () => {
  describe('Initial State', () => {
    it('should have empty password initially', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      expect(result.current.password).toBe('');
    });

    it('should default to strong preset (16 chars)', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      expect(result.current.lengthPreset).toBe('strong');
      expect(result.current.length).toBe(16);
    });

    it('should have all character options enabled by default', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      expect(result.current.options).toEqual({
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
      });
    });

    it('should have empty history initially', () => {
      const { result } = renderHook(() => usePasswordGenerator());
      expect(result.current.history).toEqual([]);
    });
  });

  describe('Password Generation', () => {
    it('should generate password when generate() is called', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      act(() => {
        result.current.generate();
      });

      expect(result.current.password).toHaveLength(16);
    });

    it('should add generated password to history', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      act(() => {
        result.current.generate();
      });

      expect(result.current.history).toHaveLength(1);
      expect(result.current.history[0].password).toBe(result.current.password);
      expect(result.current.history[0].timestamp).toBeInstanceOf(Date);
    });

    it('should limit history to 10 entries', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      act(() => {
        for (let i = 0; i < 15; i++) {
          result.current.generate();
        }
      });

      expect(result.current.history).toHaveLength(10);
    });

    it('should add new passwords to the beginning of history', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      act(() => {
        result.current.generate();
      });
      const firstPassword = result.current.password;

      act(() => {
        result.current.generate();
      });
      const secondPassword = result.current.password;

      expect(result.current.history[0].password).toBe(secondPassword);
      expect(result.current.history[1].password).toBe(firstPassword);
    });
  });

  describe('Length Presets', () => {
    it('should update length when preset changes to short', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      act(() => {
        result.current.setLengthPreset('short');
      });

      expect(result.current.lengthPreset).toBe('short');
      expect(result.current.length).toBe(8);
    });

    it('should update length when preset changes to medium', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      act(() => {
        result.current.setLengthPreset('medium');
      });

      expect(result.current.lengthPreset).toBe('medium');
      expect(result.current.length).toBe(12);
    });

    it('should update length when preset changes to maximum', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      act(() => {
        result.current.setLengthPreset('maximum');
      });

      expect(result.current.lengthPreset).toBe('maximum');
      expect(result.current.length).toBe(32);
    });

    it('should generate password with correct length after preset change', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      act(() => {
        result.current.setLengthPreset('short');
      });

      act(() => {
        result.current.generate();
      });

      expect(result.current.password).toHaveLength(8);
    });
  });

  describe('Character Options Toggle', () => {
    it('should toggle uppercase option', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      act(() => {
        result.current.toggleOption('uppercase');
      });

      expect(result.current.options.uppercase).toBe(false);
    });

    it('should toggle lowercase option', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      act(() => {
        result.current.toggleOption('lowercase');
      });

      expect(result.current.options.lowercase).toBe(false);
    });

    it('should toggle numbers option', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      act(() => {
        result.current.toggleOption('numbers');
      });

      expect(result.current.options.numbers).toBe(false);
    });

    it('should toggle special option', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      act(() => {
        result.current.toggleOption('special');
      });

      expect(result.current.options.special).toBe(false);
    });

    it('should prevent disabling all options (keep at least one)', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      act(() => {
        result.current.toggleOption('uppercase');
        result.current.toggleOption('lowercase');
        result.current.toggleOption('numbers');
        // Try to disable the last option (special)
        result.current.toggleOption('special');
      });

      // At least one should still be enabled
      const activeCount = Object.values(result.current.options).filter(Boolean).length;
      expect(activeCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe('History Management', () => {
    it('should clear history when clearHistory() is called', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      act(() => {
        result.current.generate();
        result.current.generate();
        result.current.generate();
      });

      expect(result.current.history).toHaveLength(3);

      act(() => {
        result.current.clearHistory();
      });

      expect(result.current.history).toEqual([]);
    });
  });

  describe('LENGTH_PRESETS Export', () => {
    it('should export LENGTH_PRESETS with correct values', () => {
      const { result } = renderHook(() => usePasswordGenerator());

      expect(result.current.LENGTH_PRESETS).toEqual({
        short: 8,
        medium: 12,
        strong: 16,
        maximum: 32,
      });
    });
  });
});
