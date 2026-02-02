# SecurePass Generator - Planning Document

## Project Overview

A React-based web application for generating secure, customizable passwords with a modern dark theme UI.

---

## Application Architecture

### Technology Stack
- **Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** CSS (Dark theme with neon accents)
- **State Management:** React Hooks

### Directory Structure

```
password-generator/
├── public/
├── src/
│   ├── components/       # UI Components
│   ├── hooks/            # Custom React Hooks
│   ├── utils/            # Core Business Logic
│   ├── styles/           # Global Styles
│   ├── App.jsx           # Main Application
│   └── main.jsx          # Entry Point
├── docs/                 # Documentation
├── package.json
└── CLAUDE.md
```

---

## Component Hierarchy

```
App
├── Header
├── PasswordDisplay
│   └── CopyButton
├── StrengthMeter
├── LengthSelector
├── CharacterToggles
├── PasswordHistory
│   └── HistoryItem(s)
└── KeyboardShortcuts
```

---

## Application Flow Diagram

```mermaid
flowchart TD
    A[User Opens App] --> B[App Initializes]
    B --> C[Generate Initial Password]
    C --> D[Display Password]

    subgraph "User Interactions"
        E[Select Length Preset]
        F[Toggle Character Types]
        G[Click Generate]
        H[Press Enter Key]
        I[Click Copy]
        J[Press Ctrl+C]
    end

    E --> K[Update Length State]
    F --> L[Update Options State]
    G --> M[Generate New Password]
    H --> M

    K --> M
    L --> M

    M --> N{Valid Options?}
    N -->|Yes| O[crypto.getRandomValues]
    N -->|No| P[Show Error]

    O --> Q[Build Password String]
    Q --> R[Update Password State]
    R --> S[Add to History]
    S --> D

    I --> T[Copy to Clipboard]
    J --> T
    T --> U[Show Copied Feedback]

    D --> V[Calculate Strength]
    V --> W[Update Strength Meter]
```

---

## Data Flow Diagram

```mermaid
flowchart LR
    subgraph "State (usePasswordGenerator)"
        PS[password]
        LP[lengthPreset]
        OPT[options]
        HIST[history]
    end

    subgraph "Utils"
        GP[generatePassword.js]
        CS[calculateStrength.js]
    end

    subgraph "Components"
        PD[PasswordDisplay]
        LS[LengthSelector]
        CT[CharacterToggles]
        SM[StrengthMeter]
        PH[PasswordHistory]
    end

    LP --> GP
    OPT --> GP
    GP --> PS
    PS --> PD
    PS --> HIST

    LP --> CS
    OPT --> CS
    CS --> SM

    HIST --> PH

    LS -->|setLengthPreset| LP
    CT -->|toggleOption| OPT
```

---

## Password Generation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant H as usePasswordGenerator
    participant G as generatePassword()
    participant C as crypto API

    U->>A: Click Generate / Press Enter
    A->>H: Call generate()
    H->>G: generatePassword(length, options)
    G->>G: Build character set
    G->>C: crypto.getRandomValues(array)
    C-->>G: Random Uint32Array
    G->>G: Map to characters
    G-->>H: Return password string
    H->>H: Update state
    H->>H: Add to history
    H-->>A: Trigger re-render
    A-->>U: Display new password
```

---

## State Management

```mermaid
stateDiagram-v2
    [*] --> Idle

    Idle --> Generating: Generate Triggered
    Generating --> Displaying: Password Created
    Displaying --> Idle: Ready for Next

    Displaying --> Copied: Copy Triggered
    Copied --> Displaying: Timeout (2s)

    state Displaying {
        [*] --> ShowPassword
        ShowPassword --> UpdateStrength
        UpdateStrength --> UpdateHistory
    }
```

---

## Key Features

### 1. Password Generation
- Cryptographically secure using `crypto.getRandomValues()`
- Configurable character types (uppercase, lowercase, numbers, special)
- Preset lengths: 8, 12, 16, 32 characters

### 2. Strength Indicator
| Length | Character Types | Strength |
|--------|----------------|----------|
| < 8    | Any            | Weak     |
| 8-11   | 2+             | Fair     |
| 12-15  | 3+             | Good     |
| 16+    | All 4          | Strong   |

### 3. Password History
- Session-based (cleared on tab close)
- Last 10 passwords stored
- Masked by default, reveal on hover
- Individual copy buttons

### 4. Keyboard Shortcuts
| Key | Action |
|-----|--------|
| Enter | Generate password |
| Ctrl+C | Copy password |
| Escape | Clear history |

---

## Security Considerations

1. **No Server Communication** - All generation client-side
2. **Secure Randomness** - Uses Web Crypto API
3. **No Persistent Storage** - History in memory only
4. **No External Dependencies** - Core logic dependency-free

---

## Future Enhancements (V2+)

- [ ] Pronounceable passwords
- [ ] Passphrase generator
- [ ] Custom special character set
- [ ] Export to file
- [ ] PWA support
- [ ] Browser extension

---

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
