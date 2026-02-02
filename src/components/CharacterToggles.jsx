const TOGGLE_LABELS = {
  uppercase: { label: 'Uppercase', hint: 'A-Z' },
  lowercase: { label: 'Lowercase', hint: 'a-z' },
  numbers: { label: 'Numbers', hint: '0-9' },
  special: { label: 'Special', hint: '!@#$%^&*' },
};

export function CharacterToggles({ options, onToggle }) {
  return (
    <div className="character-toggles">
      <label className="section-label">Character Types</label>
      <div className="toggle-grid">
        {Object.entries(TOGGLE_LABELS).map(([key, { label, hint }]) => (
          <button
            key={key}
            className={`toggle-btn ${options[key] ? 'active' : ''}`}
            onClick={() => onToggle(key)}
            aria-pressed={options[key]}
          >
            <span className="toggle-label">{label}</span>
            <span className="toggle-hint">{hint}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
