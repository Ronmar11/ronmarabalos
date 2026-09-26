import { sitePath } from './sitePath.js';

/**
 * Guards URLs that come from the database before they reach href/src.
 * Allows http(s), mailto and site-relative paths; anything else (notably
 * `javascript:`) becomes an empty string. Site-relative paths are adjusted for
 * the folder the site is deployed under (see sitePath).
 */
export function safeUrl(value) {
  if (typeof value !== 'string') return '';
  const url = value.trim();
  if (!url) return '';
  if (url.startsWith('/') && !url.startsWith('//')) return sitePath(url);
  try {
    const { protocol } = new URL(url);
    return ['http:', 'https:', 'mailto:'].includes(protocol) ? url : '';
  } catch {
    return '';
  }
}
