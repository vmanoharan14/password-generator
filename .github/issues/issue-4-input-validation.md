## Bug: Missing Input Validation

**Severity:** High  
**File:** `src/utils/generatePassword.js:18`  
**Impact:** DoS / Unexpected behavior

### Problem
No validation on the `length` parameter:
- Negative numbers accepted
- Zero length accepted  
- Floating point numbers accepted
- No maximum limit (could DoS with length=1,000,000)

### Solution

```javascript
export function generatePassword(length, options) {
  if (!Number.isInteger(length) || length < 1 || length > 128) {
    throw new Error('Length must be an integer between 1 and 128');
  }
  // ... rest of function
}
```

### References
- See full audit: `docs/SECURITY_AUDIT.md`
