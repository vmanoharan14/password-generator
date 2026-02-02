## Security Issue: Modulo Bias

**Severity:** Critical  
**File:** `src/utils/generatePassword.js:36`  
**Impact:** Statistical bias in password generation

### Problem
The password generation uses modulo operation which introduces slight statistical bias:

```javascript
password += charset[array[i] % charset.length];
```

When `charset.length` doesn't evenly divide 2^32, characters at the beginning of the charset have slightly higher probability.

### Impact
- For 70-char charset: ~0.000003% bias per character
- Accumulates over multiple passwords
- Violates cryptographic correctness principle

### Solution
Implement rejection sampling:

```javascript
function getRandomChar(charset) {
  const maxValid = Math.floor(0xFFFFFFFF / charset.length) * charset.length;
  let randomValue;
  do {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    randomValue = array[0];
  } while (randomValue >= maxValid);
  return charset[randomValue % charset.length];
}
```

### References
- See full audit: `docs/SECURITY_AUDIT.md`
- CWE-338: Use of Cryptographically Weak PRNG
