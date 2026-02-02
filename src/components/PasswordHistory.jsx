import { useState } from 'react';
import { useClipboard } from '../hooks/useClipboard';

function HistoryItem({ entry }) {
  const [revealed, setRevealed] = useState(false);
  const { copied, copyToClipboard } = useClipboard();

  const maskedPassword = '•'.repeat(entry.password.length);
  const timeString = entry.timestamp.toLocaleTimeString();

  return (
    <div className="history-item">
      <span
        className="history-password"
        onMouseEnter={() => setRevealed(true)}
        onMouseLeave={() => setRevealed(false)}
        onClick={() => setRevealed(!revealed)}
      >
        {revealed ? entry.password : maskedPassword}
      </span>
      <span className="history-time">{timeString}</span>
      <button
        className={`history-copy-btn ${copied ? 'copied' : ''}`}
        onClick={() => copyToClipboard(entry.password)}
      >
        {copied ? '✓' : 'Copy'}
      </button>
    </div>
  );
}

export function PasswordHistory({ history, onClear }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className="password-history">
      <button
        className="history-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        <span>History ({history.length})</span>
        <span className={`arrow ${isExpanded ? 'up' : 'down'}`}>▼</span>
      </button>
      {isExpanded && (
        <div className="history-content">
          <div className="history-list">
            {history.map((entry) => (
              <HistoryItem key={entry.id} entry={entry} />
            ))}
          </div>
          <button className="clear-history-btn" onClick={onClear}>
            Clear History
          </button>
        </div>
      )}
    </div>
  );
}
