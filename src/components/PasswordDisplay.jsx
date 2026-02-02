import { useClipboard } from '../hooks/useClipboard';

export function PasswordDisplay({ password, onGenerate }) {
  const { copied, copyToClipboard } = useClipboard();

  return (
    <div className="password-display">
      <div className="password-container">
        <input
          type="text"
          value={password}
          readOnly
          placeholder="Click Generate to create password"
          className="password-input"
          aria-label="Generated password"
        />
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={() => copyToClipboard(password)}
          disabled={!password}
          aria-label="Copy password to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <button className="generate-btn" onClick={onGenerate}>
        Generate Password
      </button>
    </div>
  );
}
