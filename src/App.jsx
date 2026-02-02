import { useEffect, useCallback } from 'react';
import { usePasswordGenerator } from './hooks/usePasswordGenerator';
import { useClipboard } from './hooks/useClipboard';
import { PasswordDisplay } from './components/PasswordDisplay';
import { LengthSelector } from './components/LengthSelector';
import { CharacterToggles } from './components/CharacterToggles';
import { StrengthMeter } from './components/StrengthMeter';
import { PasswordHistory } from './components/PasswordHistory';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';

function App() {
  const {
    password,
    length,
    lengthPreset,
    setLengthPreset,
    options,
    toggleOption,
    generate,
    history,
    clearHistory,
  } = usePasswordGenerator();

  const { copyToClipboard } = useClipboard();

  // Generate initial password on mount
  useEffect(() => {
    generate();
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        generate();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        clearHistory();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c' && password) {
        // Only handle if no text is selected
        if (!window.getSelection().toString()) {
          e.preventDefault();
          copyToClipboard(password);
        }
      }
    },
    [generate, clearHistory, password, copyToClipboard]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="app">
      <header className="header">
        <h1>SecurePass Generator</h1>
        <p>Generate strong, secure passwords instantly</p>
      </header>

      <main>
        <PasswordDisplay password={password} onGenerate={generate} />

        <StrengthMeter length={length} options={options} />

        <LengthSelector
          preset={lengthPreset}
          onPresetChange={setLengthPreset}
        />

        <CharacterToggles options={options} onToggle={toggleOption} />

        <PasswordHistory history={history} onClear={clearHistory} />
      </main>

      <footer>
        <KeyboardShortcuts />
      </footer>
    </div>
  );
}

export default App;
