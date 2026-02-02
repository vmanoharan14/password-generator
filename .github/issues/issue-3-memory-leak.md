## Bug: Memory Leak

**Severity:** High  
**File:** `src/hooks/useClipboard.js:10`  
**Impact:** Performance degradation

### Problem
The setTimeout is not cleared if the component unmounts:

```javascript
setTimeout(() => setCopied(false), resetDelay);
```

### Impact
- Can cause state updates on unmounted components
- Memory leaks in long-running sessions
- Multiple rapid copies create multiple timeouts

### Solution

```javascript
import { useState, useCallback, useRef, useEffect } from 'react';

export function useClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const copyToClipboard = useCallback(async (text) => {
    try {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      await navigator.clipboard.writeText(text);
      setCopied(true);
      timeoutRef.current = setTimeout(() => setCopied(false), resetDelay);
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      return false;
    }
  }, [resetDelay]);

  return { copied, copyToClipboard };
}
```

### References
- See full audit: `docs/SECURITY_AUDIT.md`
