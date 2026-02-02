## Security Issue: No Entropy Calculation

**Severity:** Critical  
**File:** `src/utils/calculateStrength.js`  
**Impact:** Misleading strength ratings

### Problem
The strength meter uses arbitrary heuristics instead of calculating actual Shannon entropy:

```javascript
// Current (WRONG)
if (length < 8 || activeTypes === 1) return { level: 1, label: 'Weak' };
```

### Real Entropy Examples

| Config | Charset | 16-char Entropy | Actual Rating |
|--------|---------|-----------------|---------------|
| Lowercase only | 26 | 75 bits | WEAK |
| Numbers only | 10 | 53 bits | TERRIBLE |
| All types | 70 | 98 bits | GOOD |

### Solution
Calculate actual entropy:

```javascript
const entropy = length * Math.log2(charsetSize);

if (entropy < 28) return { level: 1, label: 'Very Weak', entropy };
if (entropy < 36) return { level: 2, label: 'Weak', entropy };
if (entropy < 60) return { level: 3, label: 'Fair', entropy };
if (entropy < 80) return { level: 4, label: 'Good', entropy };
if (entropy < 128) return { level: 5, label: 'Strong', entropy };
return { level: 6, label: 'Very Strong', entropy };
```

### References
- See full audit: `docs/SECURITY_AUDIT.md`
- NIST SP 800-63B: Digital Identity Guidelines
