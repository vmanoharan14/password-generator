# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SecurePass Generator - A React web application for generating secure, customizable passwords with a dark theme UI.

## Build and Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

- **Framework:** React 18+ with Vite
- **Styling:** CSS Modules with dark theme
- **State:** React hooks (useState, useContext)

### Key Directories

- `src/components/` - React UI components
- `src/hooks/` - Custom React hooks (usePasswordGenerator, useClipboard)
- `src/utils/` - Core logic (generatePassword.js, calculateStrength.js)
- `src/styles/` - Theme and global styles

### Security Requirements

- Password generation MUST use `crypto.getRandomValues()` for cryptographic randomness
- All generation happens client-side - no server communication
- No persistent password storage beyond session memory
