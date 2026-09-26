import { safeUrl } from '../lib/safeUrl.js';

/**
 * One entry per content list the admin can edit. CollectionEditor renders
 * the list, form, validation and ordering from these definitions, so adding a
 * field is a one-line change here plus a column in supabase/schema.sql.
 *
 * Field types: text | textarea | url | select | image | icon | tags | images | links
 * `summary(row)` returns what the list row shows: { title, subtitle, image, icon }.
 */
export const COLLECTIONS = [
  {
    id: 'skills',
    table: 'skills',
    label: 'Tech stack',
    itemName: 'skill',
    description: 'The buttons in the Tech Stack section. Give each one an icon class or an icon image.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, maxLength: 60, placeholder: 'e.g. TypeScript' },
      { name: 'experience', label: 'Hover text', type: 'text', placeholder: 'e.g. 1 yr Exp', help: 'Shown when a visitor hovers the button.' },
      {
        name: 'icon_class',
        label: 'Icon class',
        type: 'icon',
        placeholder: 'devicon-typescript-plain colored',
        help: 'From devicon.dev, remixicon.com or fontawesome.com. Leave empty to use an image instead.',
      },
      { name: 'icon_url', label: 'Icon image', type: 'image', folder: 'skills', help: 'Used only when the icon class is empty.' },
    ],
    summary: (row) => ({ title: row.name, subtitle: row.experience, icon: row.icon_class, image: row.icon_url }),
  },
  {
    id: 'projects',
    table: 'projects',
    label: 'Projects',
    itemName: 'project',
    description: 'The project cards.',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, maxLength: 120 },
      { name: 'description', label: 'Description', type: 'textarea', rows: 4 },
      {
        name: 'file_name',
        label: 'File name in the window bar',
        type: 'text',
        placeholder: 'e.g. MyApp.java',
        help: 'The small filename above the screenshot. Optional.',
      },
      {
        name: 'media',
        label: 'Screenshot layout',
        type: 'select',
        options: [
          { value: 'wide', label: 'Wide — one landscape screenshot' },
          { value: 'dual', label: 'Dual — wide shot + tall side shot (needs 2 screenshots)' },
          { value: 'portrait', label: 'Portrait — a phone screenshot, shown whole' },
        ],
      },
      { name: 'tags', label: 'Tech tags', type: 'tags', placeholder: 'React, Tailwind CSS, Supabase', help: 'Separate with commas.' },
      { name: 'images', label: 'Screenshots', type: 'images', folder: 'projects' },
      { name: 'links', label: 'Links', type: 'links' },
    ],
    summary: (row) => ({
      title: row.title,
      subtitle: (row.tags ?? []).join(' · '),
      image: row.images?.[0]?.src,
    }),
  },
  {
    id: 'about',
    table: 'about_paragraphs',
    label: 'About paragraphs',
    itemName: 'paragraph',
    description: 'The numbered paragraphs in the About window.',
    fields: [{ name: 'body', label: 'Paragraph', type: 'textarea', required: true, rows: 5, maxLength: 2000 }],
    summary: (row) => ({ title: row.body }),
  },
  {
    id: 'facts',
    table: 'quick_facts',
    label: 'Quick facts',
    itemName: 'fact',
    description: 'The `const ronmar = { … }` code block under your About text.',
    fields: [
      { name: 'key', label: 'Key', type: 'text', required: true, maxLength: 40, placeholder: 'e.g. school' },
      { name: 'value', label: 'Value', type: 'text', required: true, maxLength: 200 },
    ],
    summary: (row) => ({ title: row.key, subtitle: row.value }),
  },
  {
    id: 'roles',
    table: 'hero_roles',
    label: 'Hero roles',
    itemName: 'role',
    description: 'The phrases typed out under your name, in order.',
    fields: [{ name: 'text', label: 'Role', type: 'text', required: true, maxLength: 80, placeholder: 'e.g. Java Backend Developer' }],
    summary: (row) => ({ title: row.text }),
  },
  {
    id: 'reels',
    table: 'video_projects',
    label: 'Video reels',
    itemName: 'reel',
    description: 'The media reels under your projects.',
    fields: [
      { name: 'thumbnail_url', label: 'Thumbnail', type: 'image', required: true, folder: 'reels', help: 'Portrait (9:16) images look best.' },
      { name: 'url', label: 'Video link', type: 'url', placeholder: 'https://www.facebook.com/reel/…' },
      { name: 'alt', label: 'Description for screen readers', type: 'text' },
    ],
    summary: (row) => ({ title: row.alt || 'Reel', subtitle: row.url, image: row.thumbnail_url }),
  },
  {
    id: 'socials',
    table: 'social_links',
    label: 'Social links',
    itemName: 'link',
    description: 'Icon buttons under your name (hero) and in the Contact section.',
    fields: [
      {
        name: 'placement',
        label: 'Where it appears',
        type: 'select',
        required: true,
        options: [
          { value: 'hero', label: 'Hero (under your name)' },
          { value: 'contact', label: 'Contact section' },
        ],
      },
      { name: 'label', label: 'Name', type: 'text', required: true, placeholder: 'e.g. GitHub profile', help: 'Read out by screen readers, since the button is only an icon.' },
      { name: 'icon_class', label: 'Icon class', type: 'icon', required: true, placeholder: 'ri-github-fill', help: 'From remixicon.com, e.g. ri-linkedin-fill.' },
      { name: 'url', label: 'URL', type: 'url', required: true, placeholder: 'https://' },
    ],
    summary: (row) => ({
      title: row.label,
      subtitle: `${row.placement === 'hero' ? 'Hero' : 'Contact'} · ${row.url}`,
      icon: row.icon_class,
    }),
  },
];

/** An empty row for the "add" form. */
export function blankRow(collection) {
  const row = {};
  for (const field of collection.fields) {
    if (field.type === 'tags' || field.type === 'images' || field.type === 'links') row[field.name] = [];
    else if (field.type === 'select') row[field.name] = field.options[0].value;
    else row[field.name] = '';
  }
  return row;
}

const isBlank = (value) =>
  value == null || (typeof value === 'string' && !value.trim()) || (Array.isArray(value) && value.length === 0);

/** Returns { fieldName: message } -- empty when the row is valid. */
export function validateRow(collection, row) {
  const errors = {};
  for (const field of collection.fields) {
    const value = row[field.name];
    if (field.required && isBlank(value)) {
      errors[field.name] = `${field.label} is required.`;
      continue;
    }
    if ((field.type === 'url' || field.type === 'image') && !isBlank(value) && !safeUrl(value)) {
      errors[field.name] = 'Enter a full link starting with https:// (or a /media/… path).';
    }
    if (field.type === 'images') {
      const bad = (value ?? []).findIndex((img) => !safeUrl(img.src) || (img.dark_src && !safeUrl(img.dark_src)));
      if (bad !== -1) errors[field.name] = `Screenshot ${bad + 1} needs a valid image (upload one or paste an https:// link).`;
    }
    if (field.type === 'links') {
      const bad = (value ?? []).findIndex((link) => !safeUrl(link.url));
      if (bad !== -1) errors[field.name] = `Link ${bad + 1} needs a full URL starting with https://.`;
    }
  }
  if (collection.id === 'projects' && row.media === 'dual' && (row.images ?? []).length < 2) {
    errors.media = 'The dual layout needs two screenshots — add another, or pick Wide.';
  }
  return errors;
}
