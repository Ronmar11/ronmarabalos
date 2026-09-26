import { useState, useCallback } from 'react';

/**
 * Touch devices have no :hover, so the original toggled an `active` class on
 * tap. Returns the flag plus a click handler that flips it.
 */
export function useTapActive() {
  const [isActive, setIsActive] = useState(false);

  const toggle = useCallback((event) => {
    event.stopPropagation();
    setIsActive((prev) => !prev);
  }, []);

  return [isActive, toggle];
}
