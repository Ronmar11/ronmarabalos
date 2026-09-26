// The folder the site is served from: "/" locally, "/ronmarabalos/" on GitHub
// Pages (set at build time with `vite build --base`).
const BASE = import.meta.env.BASE_URL;

/**
 * Makes a site-relative path work under the base folder:
 * "/projects" -> "/ronmarabalos/projects". Leaves full URLs, and paths that
 * already include the base, untouched -- so database values like
 * "/media/bms.png" work both locally and when deployed.
 */
export function sitePath(path) {
  if (typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) return path;
  if (BASE !== '/' && (path === BASE.slice(0, -1) || path.startsWith(BASE))) return path;
  return BASE + path.slice(1);
}

/** The current page's path with the base folder removed: "/admin", "/projects", "/". */
export function currentRoute() {
  const path = window.location.pathname;
  const inside = BASE !== '/' && path.startsWith(BASE) ? path.slice(BASE.length - 1) : path;
  return inside.replace(/\/+$/, '') || '/';
}
