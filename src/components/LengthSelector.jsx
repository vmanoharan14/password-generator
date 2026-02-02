const PRESET_LABELS = {
  short: { label: 'Short', length: 8 },
  medium: { label: 'Medium', length: 12 },
  strong: { label: 'Strong', length: 16 },
  maximum: { label: 'Maximum', length: 32 },
};

export function LengthSelector({ preset, onPresetChange }) {
  return (
    <div className="length-selector">
      <label className="section-label">Password Length</label>
      <div className="preset-buttons">
        {Object.entries(PRESET_LABELS).map(([key, { label, length }]) => (
          <button
            key={key}
            className={`preset-btn ${preset === key ? 'active' : ''}`}
            onClick={() => onPresetChange(key)}
            aria-pressed={preset === key}
          >
            <span className="preset-label">{label}</span>
            <span className="preset-length">{length}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
