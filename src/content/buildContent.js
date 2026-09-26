import { DEFAULT_SETTINGS } from './settings.js';

const bySortOrder = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);
const sorted = (rows) => [...(rows ?? [])].sort(bySortOrder);
const str = (value) => (typeof value === 'string' ? value : '');

/**
 * Turns table rows (from Supabase or from DEFAULT_ROWS) into the shape the
 * page components render. Every field is defensively normalised so a
 * half-filled row from the admin can never crash the public page.
 */
export function buildContent(rows) {
  const settings = { ...DEFAULT_SETTINGS };
  for (const { key, value } of rows.site_settings ?? []) {
    if (key in settings && typeof value === 'string') settings[key] = value;
  }

  const socials = sorted(rows.social_links).map((row) => ({
    id: row.id,
    placement: row.placement,
    label: str(row.label),
    iconClass: str(row.icon_class),
    url: str(row.url),
  }));

  return {
    settings,

    heroRoles: sorted(rows.hero_roles)
      .map((row) => str(row.text).trim())
      .filter(Boolean),

    aboutParagraphs: sorted(rows.about_paragraphs)
      .map((row) => ({ id: row.id, text: str(row.body) }))
      .filter((p) => p.text.trim()),

    quickFacts: sorted(rows.quick_facts)
      .map((row) => ({ id: row.id, key: str(row.key), value: str(row.value) }))
      .filter((f) => f.key && f.value),

    skills: sorted(rows.skills).map((row) => ({
      id: row.id,
      name: str(row.name),
      exp: str(row.experience),
      iconClass: str(row.icon_class),
      iconSrc: str(row.icon_url),
    })),

    projects: sorted(rows.projects).map((row) => {
      const images = (Array.isArray(row.images) ? row.images : [])
        .filter((img) => img && str(img.src))
        .map((img) => ({ src: str(img.src), darkSrc: str(img.dark_src), alt: str(img.alt) }));
      // "dual" needs two screenshots; with fewer, show it as a single wide one.
      const media =
        row.media === 'dual' && images.length < 2 ? 'wide' : ['wide', 'dual', 'portrait'].includes(row.media) ? row.media : 'wide';
      return {
        id: row.id,
        title: str(row.title),
        description: str(row.description),
        file: str(row.file_name),
        media,
        tags: (Array.isArray(row.tags) ? row.tags : []).map(str).filter(Boolean),
        images,
        links: (Array.isArray(row.links) ? row.links : [])
          .filter((link) => link && str(link.url))
          .map((link) => ({ type: str(link.type) || 'link', label: str(link.label) || 'Link', url: str(link.url) })),
      };
    }),

    videoProjects: sorted(rows.video_projects)
      .filter((row) => str(row.thumbnail_url))
      .map((row) => ({ id: row.id, thumbnail: str(row.thumbnail_url), url: str(row.url), alt: str(row.alt) })),

    heroSocials: socials.filter((s) => s.placement === 'hero'),
    contactSocials: socials.filter((s) => s.placement === 'contact'),
  };
}
