## Security Issue: Insufficient Special Characters

**Severity:** Critical  
**File:** `src/utils/generatePassword.js:5`  
**Impact:** Reduced entropy

### Problem
The special character set is too small:

```javascript
special: '!@#$%^&*',  // Only 8 characters
```

### Impact
- Industry standard: 20-30 special characters
- OWASP recommendation: Full ASCII printable specials
- Current: 8 characters = 3.0 bits/char
- Recommended: 32 characters = 5.0 bits/char
- **Entropy loss:** 2 bits per special character position

### Solution

```javascript
special: '!@#$%^&*()_+-=[]{}|;:,<>?',
```

### References
- See full audit: `docs/SECURITY_AUDIT.md`
- OWASP Password Special Characters
