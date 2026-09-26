/**
 * Every editable piece of free-form page text, in the order the admin form
 * shows it. `value` is the default used before Supabase has any data.
 * type: 'text' | 'textarea' | 'image'
 */
export const SETTINGS_GROUPS = [
  {
    title: 'Hero',
    fields: [
      { key: 'hero_name', label: 'Your name', type: 'text', value: 'Ronmar Abalos' },
      {
        key: 'hero_tagline',
        label: 'Tagline',
        type: 'textarea',
        value: 'I enjoy developing innovative projects and exploring emerging technologies.',
      },
    ],
  },
  {
    title: 'Portrait',
    note: 'The hero photo and chat avatar. Hover images swap in when the cursor is over the photo.',
    fields: [
      { key: 'portrait_day', label: 'Light mode', type: 'image', value: '/media/profile1.png' },
      { key: 'portrait_day_hover', label: 'Light mode (hover)', type: 'image', value: '/media/profile1.png' },
      { key: 'portrait_night', label: 'Dark mode', type: 'image', value: '/media/profile1.png' },
      { key: 'portrait_night_hover', label: 'Dark mode (hover)', type: 'image', value: '/media/profile1.png' },
    ],
  },
  {
    title: 'Section headings',
    fields: [
      { key: 'about_title', label: 'About heading', type: 'text', value: 'About Me' },
      { key: 'techstack_title', label: 'Tech Stack heading', type: 'text', value: 'Tech Stack' },
      {
        key: 'techstack_quote',
        label: 'Tech Stack tagline',
        type: 'textarea',
        value: 'Every tool is a step toward smarter creations—and every day is a chance to learn more.',
      },
      { key: 'projects_title', label: 'Projects heading', type: 'text', value: 'Projects' },
      {
        key: 'projects_quote',
        label: 'Projects tagline',
        type: 'textarea',
        value: "A showcase of open-source projects I've developed.",
      },
      {
        key: 'videos_caption',
        label: 'Video reels caption',
        type: 'textarea',
        value: 'Worked with the ITSC Media Group at CLSU to create multimedia edits and animations.',
      },
      { key: 'contact_title', label: 'Contact heading', type: 'text', value: 'Get in touch' },
      {
        key: 'contact_quote',
        label: 'Contact tagline',
        type: 'textarea',
        value: 'Every connection is a new opportunity — let’s start something great.',
      },
    ],
  },
  {
    title: 'GitHub',
    fields: [
      {
        key: 'github_username',
        label: 'GitHub username (leave empty to hide the contribution graph)',
        type: 'text',
        value: 'Ronmar11',
      },
    ],
  },
  {
    title: 'Contact & footer',
    fields: [
      { key: 'contact_email', label: 'Email', type: 'text', value: 'abalosronmar1@gmail.com' },
      { key: 'contact_location', label: 'Location', type: 'text', value: 'Nueva Ecija, Philippines' },
      {
        key: 'footer_text',
        label: 'Footer text',
        type: 'text',
        value: '© 2026 Ronmar Abalos. All rights reserved.',
      },
    ],
  },
];

export const SETTINGS_FIELDS = SETTINGS_GROUPS.flatMap((group) => group.fields);

export const DEFAULT_SETTINGS = Object.fromEntries(
  SETTINGS_FIELDS.map((field) => [field.key, field.value])
);
