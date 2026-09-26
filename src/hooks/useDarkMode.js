import { useEffect, useState } from 'react';

const STORAGE_KEY = 'dark-mode';

const getInitialValue = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === '1') return true;
  if (stored === '0') return false;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
};

/** Stored preference first, OS preference as the fallback. */
export function useDarkMode() {
  const [isDark, setIsDark] = useState(getInitialValue);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(STORAGE_KEY, isDark ? '1' : '0');
  }, [isDark]);

  return [isDark, setIsDark];
}
