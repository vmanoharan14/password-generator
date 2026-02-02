import { useState, useCallback } from 'react';
import { generatePassword } from '../utils/generatePassword';

const LENGTH_PRESETS = {
  short: 8,
  medium: 12,
  strong: 16,
  maximum: 32,
};

export function usePasswordGenerator() {
  const [password, setPassword] = useState('');
  const [lengthPreset, setLengthPreset] = useState('strong');
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
  });
  const [history, setHistory] = useState([]);

  const length = LENGTH_PRESETS[lengthPreset];

  const generate = useCallback(() => {
    try {
      const newPassword = generatePassword(length, options);
      setPassword(newPassword);
      setHistory((prev) => [
        { password: newPassword, timestamp: new Date(), id: crypto.randomUUID() },
        ...prev.slice(0, 9),
      ]);
      return newPassword;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }, [length, options]);

  const toggleOption = useCallback((key) => {
    setOptions((prev) => {
      const newOptions = { ...prev, [key]: !prev[key] };
      const activeCount = Object.values(newOptions).filter(Boolean).length;
      if (activeCount === 0) return prev;
      return newOptions;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    password,
    length,
    lengthPreset,
    setLengthPreset,
    options,
    toggleOption,
    generate,
    history,
    clearHistory,
    LENGTH_PRESETS,
  };
}
