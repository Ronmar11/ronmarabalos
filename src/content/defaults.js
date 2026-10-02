import { DEFAULT_SETTINGS } from './settings.js';

/**
 * The site's built-in content, written in the exact shape of the Supabase
 * tables. It is used:
 *   - to generate supabase/seed.sql (so the database starts with this content)
 *   - as the fallback when Supabase isn't configured or can't be reached.
 * Once the database is seeded, edit content in /admin, not here.
 */
export const DEFAULT_ROWS = {
  site_settings: Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({ key, value })),

  hero_roles: [
    { text: 'Software Engineer' },
    { text: 'Java Backend Developer' },
    { text: 'IT Student @ CLSU' },
    { text: 'Web & Mobile App Builder' },
  ],

  about_paragraphs: [
    {
      body: "I'm a Bachelor of Science in Information Technology student at Central Luzon State University. I enjoy building school projects including mobile application, web application and other System Development projects.",
    },
    {
      body: 'When I was a Senior High School student; this is where it all began. I started learning HTML, CSS, and JavaScript, and built projects about web and mobile app.',
    },
    {
      body: 'I have over four years of experience in coding, working on both frontend and backend development. Java is my main backend language, and I have returned to web development with HTML, CSS, JavaScript, React and Tailwind CSS.',
    },
    {
      body: 'I am eager to continue developing my skills in software and web development, and I look forward to contributing to innovative projects that make a real impact.',
    },
  ],

  quick_facts: [
    { key: 'school', value: 'Central Luzon State University' },
    { key: 'course', value: 'BS Information Technology' },
    { key: 'focus', value: 'Frontend and Backend Development' },
    { key: 'experience', value: '4+ years of coding' },
    { key: 'location', value: 'Nueva Ecija, PH' },
  ],

  skills: [
    { name: 'Html', experience: '3 years Exp', icon_class: 'devicon-html5-plain colored' },
    { name: 'Css', experience: '3 yrs Exp', icon_class: 'devicon-css3-plain colored' },
    { name: 'javascript', experience: '2 years Exp', icon_class: 'devicon-javascript-plain colored' },
    {
      name: 'Java',
      experience: '3 yrs Exp',
      icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    },
    {
      name: 'PHP',
      experience: '3M Exp',
      icon_url: 'https://cdn-icons-png.flaticon.com/128/5968/5968332.png',
    },
    {
      name: 'React',
      experience: '6M Exp',
      icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    },
    {
      name: 'Tailwind css',
      experience: '6M Exp',
      icon_url:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1280px-Tailwind_CSS_Logo.svg.png',
    },
    { name: 'MySQL', experience: '1 yr Exp', icon_class: 'devicon-mysql-plain colored' },
    { name: 'Firebase', experience: 'cloud-based platform', icon_class: 'devicon-firebase-plain colored' },
    { name: 'Git', experience: 'Devtool', icon_class: 'devicon-git-plain colored' },
    { name: 'Github', experience: 'Devtool', icon_class: 'ri-github-fill' },
    { name: 'Vs Code', experience: 'Devtool', icon_class: 'devicon-vscode-plain colored' },
    {
      name: 'Figma',
      experience: 'CMS',
      icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
    },
    {
      name: 'PhotoShop',
      experience: 'Editing Tool',
      icon_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg',
    },
    {
      name: 'PremierePro',
      experience: 'Editing Tool',
      icon_url: 'https://cdn-icons-png.freepik.com/512/9814/9814226.png?ga=GA1.1.1666536704.1757247391',
    },
  ],

  projects: [
    {
      title: 'Porfolio Website',
      featured: true,
      description:
        'This website presents my projects and skills, giving a clear view of what I can do and what I continue to learn',
      file_name: 'portfolio.jsx',
      media: 'dual',
      tags: ['React', 'Tailwind CSS', 'Vite', 'Express'],
      images: [
        { src: '/media/Porfolio.png', dark_src: '/media/Portfolio-night.png', alt: 'Portfolio website home page' },
        {
          src: '/media/Portfolio2.png',
          dark_src: '/media/Portfolio2-night.png',
          alt: 'Portfolio website projects section',
        },
      ],
      links: [{ type: 'github', label: 'Source Code', url: 'https://github.com/ronmarabalos/ronmarabalos' }],
    },
    {
      title: 'Buyer Monitoring System',
      featured: true,
      description:
        'This was projected by OOP subject, it was developed using java & mysql database, also it has UI using javaswing.',
      file_name: 'BuyerMonitoring.java',
      media: 'wide',
      tags: ['Java', 'MySQL', 'Swing'],
      images: [{ src: '/media/bms.png', alt: 'Buyer Monitoring System desktop interface' }],
      links: [
        { type: 'github', label: 'Source Code', url: 'https://github.com/ronmarabalos/Buyer-Monitoring-System' },
        { type: 'youtube', label: 'Project Demo', url: 'https://youtu.be/QToake72wAk?si=Pj8pAlkNURbH8QiZ' },
      ],
    },
    {
      title: 'Meal Master',
      featured: true,
      description: 'It was developed using Java and Firebase as the online database in android studio.',
      file_name: 'MealMaster.apk',
      media: 'portrait',
      tags: ['Java', 'Firebase', 'Android'],
      images: [{ src: '/media/mealmaster.jpg', alt: 'Meal Master Android app screen' }],
      links: [{ type: 'github', label: 'Source Code', url: 'https://github.com/ronmarabalos/Meal_Master' }],
    },
    {
      title: 'Page Replacement Algorithm',
      description: 'It was developed using java.',
      file_name: 'PageReplacement.java',
      media: 'wide',
      tags: ['Java', 'Operating Systems'],
      images: [{ src: '/media/pra.png', alt: 'Page Replacement Algorithm program output' }],
      links: [
        { type: 'github', label: 'Source Code', url: 'https://github.com/ronmarabalos/OS-Project' },
        { type: 'youtube', label: 'Project Demo', url: 'https://youtu.be/AGk8RKtxDz0?si=jzidauNYOJh-mg7s' },
      ],
    },
    {
      title: 'System Management(CRUD)',
      description: 'It is a CRUD application and It was developed using php and phpmyadmin for a localhost.',
      file_name: 'crud.php',
      media: 'wide',
      tags: ['PHP', 'MySQL', 'phpMyAdmin'],
      images: [{ src: '/media/crud2.png', alt: 'CRUD system management web page' }],
      links: [
        { type: 'github', label: 'Source Code', url: 'https://github.com/ronmarabalos/CRUD-website-with-phpadmin.git' },
        { type: 'youtube', label: 'Project Demo', url: 'https://youtu.be/XHw33qzDVyM' },
      ],
    },
  ],

  video_projects: [
    '1194122799403154',
    '1646689352673987',
    '759842186554818',
    '1273711777626748',
    '1166808495268229',
    '1217640869783728',
    '891731700128443',
    '1439877091134563',
    '1391222805500781',
  ].map((reelId, i) => ({
    thumbnail_url: `/media/vid${i + 1}.png`,
    url: `https://www.facebook.com/reel/${reelId}/?s=fb_shorts_profile&stack_idx=0`,
    alt: `Project video ${i + 1} thumbnail`,
  })),

  social_links: [
    {
      placement: 'hero',
      label: 'Facebook profile',
      icon_class: 'ri-facebook-fill',
      url: 'https://www.facebook.com/ronmar.abalos/',
    },
    { placement: 'hero', label: 'GitHub profile', icon_class: 'ri-github-fill', url: 'https://github.com/ronmarabalos' },
    {
      placement: 'contact',
      label: 'LinkedIn profile',
      icon_class: 'ri-linkedin-fill',
      url: 'https://www.linkedin.com/in/ronmar-ezekiel-abalos-85462a396/',
    },
    {
      placement: 'contact',
      label: 'Instagram profile',
      icon_class: 'ri-instagram-line',
      url: 'https://www.instagram.com/zekiii.ee',
    },
    { placement: 'contact', label: 'GitHub profile', icon_class: 'ri-github-fill', url: 'https://github.com/ronmarabalos' },
  ],
};

/** Content tables in the order they are fetched and seeded. */
export const CONTENT_TABLES = Object.keys(DEFAULT_ROWS);

/**
 * Defaults with the id / sort_order columns the database would add, so they
 * flow through exactly the same mapping code as real rows.
 */
export function defaultRowsWithIds() {
  return Object.fromEntries(
    Object.entries(DEFAULT_ROWS).map(([table, rows]) => [
      table,
      rows.map((row, i) => (table === 'site_settings' ? row : { id: `default-${table}-${i}`, sort_order: i, ...row })),
    ])
  );
}
