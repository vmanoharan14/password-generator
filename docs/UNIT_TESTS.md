# SecurePass Generator - Unit Test Documentation

## Overview

This document describes all unit tests for the SecurePass Generator application. Tests are written using Vitest and React Testing Library.

---

## Test Structure

```
src/
├── utils/
│   ├── generatePassword.test.js    # Password generation tests
│   └── calculateStrength.test.js   # Strength calculation tests
├── hooks/
│   ├── usePasswordGenerator.test.js # Password generator hook tests
│   └── useClipboard.test.js         # Clipboard hook tests
└── test/
    └── setup.js                     # Test configuration
```

---

## 1. generatePassword.test.js

Tests for the core password generation utility.

### Test Categories

#### 1.1 Password Length Tests

| Test | Description | Assertion |
|------|-------------|-----------|
| Short preset (8) | Generate 8-char password | `toHaveLength(8)` |
| Medium preset (12) | Generate 12-char password | `toHaveLength(12)` |
| Strong preset (16) | Generate 16-char password | `toHaveLength(16)` |
| Maximum preset (32) | Generate 32-char password | `toHaveLength(32)` |

**Code Example:**
```javascript
it('should generate password with correct length for Short preset (8)', () => {
  const password = generatePassword(8, {
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
  });
  expect(password).toHaveLength(8);
});
```

#### 1.2 Character Type Tests

| Test | Enabled Options | Expected Pattern |
|------|-----------------|------------------|
| Uppercase only | `uppercase: true` | `/^[A-Z]+$/` |
| Lowercase only | `lowercase: true` | `/^[a-z]+$/` |
| Numbers only | `numbers: true` | `/^[0-9]+$/` |
| Special only | `special: true` | `/^[!@#$%^&*]+$/` |
| Alphanumeric | upper + lower + numbers | `/^[A-Za-z0-9]+$/` |
| All types | all enabled | `/^[A-Za-z0-9!@#$%^&*]+$/` |

**Code Example:**
```javascript
it('should include only uppercase letters when only uppercase is enabled', () => {
  const password = generatePassword(20, {
    uppercase: true,
    lowercase: false,
    numbers: false,
    special: false,
  });
  expect(password).toMatch(/^[A-Z]+$/);
});
```

#### 1.3 Error Handling Tests

| Test | Condition | Expected |
|------|-----------|----------|
| No types selected | All options false | Throws error |

**Code Example:**
```javascript
it('should throw error when no character types are selected', () => {
  expect(() =>
    generatePassword(16, {
      uppercase: false,
      lowercase: false,
      numbers: false,
      special: false,
    })
  ).toThrow('At least one character type must be selected');
});
```

#### 1.4 Randomness Tests

| Test | Method | Criteria |
|------|--------|----------|
| Uniqueness | Generate 3 passwords | Not all identical |
| Distribution | 1000 samples, numbers only | Within 30% variance |

**Code Example:**
```javascript
it('should produce uniform distribution (statistical test)', () => {
  const options = { uppercase: false, lowercase: false, numbers: true, special: false };
  const counts = {};
  for (let i = 0; i < 1000; i++) {
    const password = generatePassword(10, options);
    for (const char of password) {
      counts[char] = (counts[char] || 0) + 1;
    }
  }
  // Each digit should appear ~1000 times (10000 chars / 10 digits)
  const expected = 1000;
  const tolerance = 0.3;
  for (const digit of '0123456789') {
    expect(counts[digit]).toBeGreaterThan(expected * (1 - tolerance));
    expect(counts[digit]).toBeLessThan(expected * (1 + tolerance));
  }
});
```

#### 1.5 Character Sets Tests

| Test | Character Set | Expected Length |
|------|--------------|-----------------|
| Uppercase | ABCDEFGHIJKLMNOPQRSTUVWXYZ | 26 |
| Lowercase | abcdefghijklmnopqrstuvwxyz | 26 |
| Numbers | 0123456789 | 10 |
| Special | !@#$%^&* | 8 |

---

## 2. calculateStrength.test.js

Tests for the password strength calculation utility.

### Strength Levels

| Level | Label | Color | Criteria |
|-------|-------|-------|----------|
| 1 | Weak | #ef4444 (red) | < 8 chars OR 1 type |
| 2 | Fair | #f97316 (orange) | 8-11 chars + 2 types |
| 3 | Good | #eab308 (yellow) | 12-15 chars + 3 types |
| 4 | Strong | #22c55e (green) | 16+ chars + 4 types |

### Test Categories

#### 2.1 Weak Password Tests

```javascript
it('should return Weak for password less than 8 characters', () => {
  const result = calculateStrength(7, {
    uppercase: true, lowercase: true, numbers: true, special: true,
  });
  expect(result.level).toBe(1);
  expect(result.label).toBe('Weak');
  expect(result.color).toBe('#ef4444');
});

it('should return Weak for single character type regardless of length', () => {
  const result = calculateStrength(16, {
    uppercase: true, lowercase: false, numbers: false, special: false,
  });
  expect(result.level).toBe(1);
  expect(result.label).toBe('Weak');
});
```

#### 2.2 Fair Password Tests

```javascript
it('should return Fair for 8-11 chars with 2 character types', () => {
  const result = calculateStrength(10, {
    uppercase: true, lowercase: true, numbers: false, special: false,
  });
  expect(result.level).toBe(2);
  expect(result.label).toBe('Fair');
  expect(result.color).toBe('#f97316');
});
```

#### 2.3 Good Password Tests

```javascript
it('should return Good for 12-15 chars with 3 character types', () => {
  const result = calculateStrength(14, {
    uppercase: true, lowercase: true, numbers: true, special: false,
  });
  expect(result.level).toBe(3);
  expect(result.label).toBe('Good');
  expect(result.color).toBe('#eab308');
});
```

#### 2.4 Strong Password Tests

```javascript
it('should return Strong for 16+ chars with all 4 character types', () => {
  const result = calculateStrength(16, {
    uppercase: true, lowercase: true, numbers: true, special: true,
  });
  expect(result.level).toBe(4);
  expect(result.label).toBe('Strong');
  expect(result.color).toBe('#22c55e');
});
```

#### 2.5 Preset Combination Tests

| Preset | Length | Types | Expected |
|--------|--------|-------|----------|
| Short | 8 | 4 | Fair+ |
| Medium | 12 | 4 | Good+ |
| Strong | 16 | 4 | Strong |
| Maximum | 32 | 4 | Strong |

---

## 3. usePasswordGenerator.test.js

Tests for the password generator React hook.

### Test Categories

#### 3.1 Initial State Tests

```javascript
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
```

#### 3.2 Password Generation Tests

```javascript
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
```

#### 3.3 Length Preset Tests

```javascript
it('should update length when preset changes to short', () => {
  const { result } = renderHook(() => usePasswordGenerator());
  act(() => {
    result.current.setLengthPreset('short');
  });
  expect(result.current.lengthPreset).toBe('short');
  expect(result.current.length).toBe(8);
});
```

#### 3.4 Character Toggle Tests

```javascript
it('should toggle uppercase option', () => {
  const { result } = renderHook(() => usePasswordGenerator());
  act(() => {
    result.current.toggleOption('uppercase');
  });
  expect(result.current.options.uppercase).toBe(false);
});

it('should prevent disabling all options (keep at least one)', () => {
  const { result } = renderHook(() => usePasswordGenerator());
  act(() => {
    result.current.toggleOption('uppercase');
    result.current.toggleOption('lowercase');
    result.current.toggleOption('numbers');
    result.current.toggleOption('special'); // Try to disable last
  });
  const activeCount = Object.values(result.current.options).filter(Boolean).length;
  expect(activeCount).toBeGreaterThanOrEqual(1);
});
```

---

## 4. useClipboard.test.js

Tests for the clipboard React hook.

### Test Categories

#### 4.1 Initial State Tests

```javascript
it('should have copied as false initially', () => {
  const { result } = renderHook(() => useClipboard());
  expect(result.current.copied).toBe(false);
});
```

#### 4.2 Copy Functionality Tests

```javascript
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
```

#### 4.3 Error Handling Tests

```javascript
it('should return false when clipboard.writeText fails', async () => {
  navigator.clipboard.writeText = vi.fn().mockRejectedValue(new Error('Copy failed'));
  const { result } = renderHook(() => useClipboard());
  let success;
  await act(async () => {
    success = await result.current.copyToClipboard('test-password');
  });
  expect(success).toBe(false);
});
```

---

## Running Tests

### Commands

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode (development)
npm run test

# Run with coverage report
npm run test:coverage

# Run specific test file
npx vitest run src/utils/generatePassword.test.js

# Run tests matching pattern
npx vitest run -t "should generate"
```

### Configuration

Tests are configured in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
});
```

---

## Best Practices Used

1. **Descriptive test names** - Each test clearly states what it verifies
2. **Arrange-Act-Assert** - Tests follow the AAA pattern
3. **Isolation** - Each test is independent
4. **Edge cases** - Boundary conditions are tested
5. **Error scenarios** - Failure paths are verified
6. **Mocking** - External APIs (clipboard) are mocked
7. **Timer mocking** - Async delays use fake timers

---

## Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Statements | 80% | TBD |
| Branches | 75% | TBD |
| Functions | 80% | TBD |
| Lines | 80% | TBD |

Run `npm run test:coverage` to generate coverage report.
