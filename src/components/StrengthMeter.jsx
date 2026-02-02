import { calculateStrength } from '../utils/calculateStrength';

export function StrengthMeter({ length, options }) {
  const strength = calculateStrength(length, options);

  return (
    <div className="strength-meter">
      <div className="strength-bar">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`strength-segment ${level <= strength.level ? 'filled' : ''}`}
            style={{
              backgroundColor: level <= strength.level ? strength.color : undefined,
            }}
          />
        ))}
      </div>
      <span className="strength-label" style={{ color: strength.color }}>
        {strength.label}
      </span>
    </div>
  );
}
