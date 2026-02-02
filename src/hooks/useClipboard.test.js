import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useClipboard } from './useClipboard';

describe('useClipboard', () => {
  beforeEach(() => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  describe('Initial State', () => {
    it('should have copied as false initially', () => {
      const { result } = renderHook(() => useClipboard());
      expect(result.current.copied).toBe(false);
    });

    it('should return copyToClipboard function', () => {
      const { result } = renderHook(() => useClipboard());
      expect(typeof result.current.copyToClipboard).toBe('function');
    });
  });

  describe('Copy Functionality', () => {
    it('should call clipboard.writeText with provided text', async () => {
      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copyToClipboard('test-password');
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test-password');
    });

    it('should set copied to true after successful copy', async () => {
      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copyToClipboard('test-password');
      });

      expect(result.current.copied).toBe(true);
    });

    it('should return true on successful copy', async () => {
      const { result } = renderHook(() => useClipboard());

      let success;
      await act(async () => {
        success = await result.current.copyToClipboard('test-password');
      });

      expect(success).toBe(true);
    });

    it('should reset copied to false after delay', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useClipboard(1000));

      await act(async () => {
        await result.current.copyToClipboard('test-password');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.copied).toBe(false);
      vi.useRealTimers();
    });

    it('should use default 2000ms reset delay', async () => {
      vi.useFakeTimers();
      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copyToClipboard('test-password');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(1999);
      });
      expect(result.current.copied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current.copied).toBe(false);

      vi.useRealTimers();
    });
  });

  describe('Error Handling', () => {
    it('should return false when clipboard.writeText fails', async () => {
      navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('Copy failed'));

      const { result } = renderHook(() => useClipboard());

      let success;
      await act(async () => {
        success = await result.current.copyToClipboard('test-password');
      });

      expect(success).toBe(false);
    });

    it('should not set copied to true when copy fails', async () => {
      navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('Copy failed'));

      const { result } = renderHook(() => useClipboard());

      await act(async () => {
        await result.current.copyToClipboard('test-password');
      });

      expect(result.current.copied).toBe(false);
    });
  });

  describe('Custom Reset Delay', () => {
    it('should accept custom reset delay', async () => {
      vi.useFakeTimers();
      const customDelay = 500;
      const { result } = renderHook(() => useClipboard(customDelay));

      await act(async () => {
        await result.current.copyToClipboard('test-password');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(499);
      });
      expect(result.current.copied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(result.current.copied).toBe(false);

      vi.useRealTimers();
    });
  });
});
