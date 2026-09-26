-- =============================================================================
-- Starting content: everything currently on the site. Run once, after schema.sql.
-- GENERATED from src/content/defaults.js -- regenerate rather than hand-edit.
--
-- Safe to re-run: settings are only added if missing, and each list is only
-- filled if that table is still empty -- your admin edits are never overwritten.
-- =============================================================================

insert into public.site_settings (key, value) values
  ('hero_name', 'Ronmar Abalos'),
  ('hero_tagline', 'I enjoy developing innovative projects and exploring emerging technologies.'),
  ('portrait_day', '/media/profile1.png'),
  ('portrait_day_hover', '/media/profile1.png'),
  ('portrait_night', '/media/profile1.png'),
  ('portrait_night_hover', '/media/profile1.png'),
  ('about_title', 'About Me'),
  ('techstack_title', 'Tech Stack'),
  ('techstack_quote', 'Every tool is a step toward smarter creations—and every day is a chance to learn more.'),
  ('projects_title', 'Projects'),
  ('projects_quote', 'A showcase of open-source projects I''ve developed.'),
  ('videos_caption', 'Worked with the ITSC Media Group at CLSU to create multimedia edits and animations.'),
  ('contact_title', 'Get in touch'),
  ('contact_quote', 'Every connection is a new opportunity — let’s start something great.'),
  ('github_username', 'Ronmar11'),
  ('contact_email', 'abalosronmar1@gmail.com'),
  ('contact_location', 'Nueva Ecija, Philippines'),
  ('footer_text', '© 2026 Ronmar Abalos. All rights reserved.')
on conflict (key) do nothing;

insert into public.hero_roles (text, sort_order)
select * from (values
    ('Software Engineer', 0),
    ('Java Backend Developer', 1),
    ('IT Student @ CLSU', 2),
    ('Web & Mobile App Builder', 3)
) as v(text, sort_order)
where not exists (select 1 from public.hero_roles);

insert into public.about_paragraphs (body, sort_order)
select * from (values
    ('I''m a Bachelor of Science in Information Technology student at Central Luzon State University. I enjoy building school projects including mobile application, web application and other System Development projects.', 0),
    ('When I was a Senior High School student; this is where it all began. I started learning HTML, CSS, and JavaScript, and built projects about web and mobile app.', 1),
    ('I have over four years of experience in coding, working on both frontend and backend development. Java is my main backend language, and I have returned to web development with HTML, CSS, JavaScript, React and Tailwind CSS.', 2),
    ('I am eager to continue developing my skills in software and web development, and I look forward to contributing to innovative projects that make a real impact.', 3)
) as v(body, sort_order)
where not exists (select 1 from public.about_paragraphs);

insert into public.quick_facts (key, value, sort_order)
select * from (values
    ('school', 'Central Luzon State University', 0),
    ('course', 'BS Information Technology', 1),
    ('focus', 'Frontend and Backend Development', 2),
    ('experience', '4+ years of coding', 3),
    ('location', 'Nueva Ecija, PH', 4)
) as v(key, value, sort_order)
where not exists (select 1 from public.quick_facts);

insert into public.skills (name, experience, icon_class, icon_url, sort_order)
select * from (values
    ('Html', '3 years Exp', 'devicon-html5-plain colored', '', 0),
    ('Css', '3 yrs Exp', 'devicon-css3-plain colored', '', 1),
    ('javascript', '2 years Exp', 'devicon-javascript-plain colored', '', 2),
    ('Java', '3 yrs Exp', '', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg', 3),
    ('PHP', '3M Exp', '', 'https://cdn-icons-png.flaticon.com/128/5968/5968332.png', 4),
    ('React', '6M Exp', '', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', 5),
    ('Tailwind css', '6M Exp', '', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1280px-Tailwind_CSS_Logo.svg.png', 6),
    ('MySQL', '1 yr Exp', 'devicon-mysql-plain colored', '', 7),
    ('Firebase', 'cloud-based platform', 'devicon-firebase-plain colored', '', 8),
    ('Git', 'Devtool', 'devicon-git-plain colored', '', 9),
    ('Github', 'Devtool', 'ri-github-fill', '', 10),
    ('Vs Code', 'Devtool', 'devicon-vscode-plain colored', '', 11),
    ('Figma', 'CMS', '', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg', 12),
    ('PhotoShop', 'Editing Tool', '', 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg', 13),
    ('PremierePro', 'Editing Tool', '', 'https://cdn-icons-png.freepik.com/512/9814/9814226.png?ga=GA1.1.1666536704.1757247391', 14)
) as v(name, experience, icon_class, icon_url, sort_order)
where not exists (select 1 from public.skills);

insert into public.projects (title, description, file_name, media, tags, images, links, sort_order)
select * from (values
    ('Porfolio Website', 'This website presents my projects and skills, giving a clear view of what I can do and what I continue to learn', 'portfolio.jsx', 'dual', array['React', 'Tailwind CSS', 'Vite', 'Express']::text[], '[{"src":"/media/Porfolio.png","dark_src":"/media/Portfolio-night.png","alt":"Portfolio website home page"},{"src":"/media/Portfolio2.png","dark_src":"/media/Portfolio2-night.png","alt":"Portfolio website projects section"}]'::jsonb, '[{"type":"github","label":"Source Code","url":"https://github.com/Ronmar11/ronmarabalos"}]'::jsonb, 0),
    ('Buyer Monitoring System', 'This was projected by OOP subject, it was developed using java & mysql database, also it has UI using javaswing.', 'BuyerMonitoring.java', 'wide', array['Java', 'MySQL', 'Swing']::text[], '[{"src":"/media/bms.png","alt":"Buyer Monitoring System desktop interface"}]'::jsonb, '[{"type":"github","label":"Source Code","url":"https://github.com/Ronmar11/Buyer-Monitoring-System"},{"type":"youtube","label":"Project Demo","url":"https://youtu.be/QToake72wAk?si=Pj8pAlkNURbH8QiZ"}]'::jsonb, 1),
    ('Meal Master', 'It was developed using Java and Firebase as the online database in android studio.', 'MealMaster.apk', 'portrait', array['Java', 'Firebase', 'Android']::text[], '[{"src":"/media/mealmaster.jpg","alt":"Meal Master Android app screen"}]'::jsonb, '[{"type":"github","label":"Source Code","url":"https://github.com/Ronmar11/Meal_Master"}]'::jsonb, 2),
    ('Page Replacement Algorithm', 'It was developed using java.', 'PageReplacement.java', 'wide', array['Java', 'Operating Systems']::text[], '[{"src":"/media/pra.png","alt":"Page Replacement Algorithm program output"}]'::jsonb, '[{"type":"github","label":"Source Code","url":"https://github.com/Ronmar11/OS-Project"},{"type":"youtube","label":"Project Demo","url":"https://youtu.be/AGk8RKtxDz0?si=jzidauNYOJh-mg7s"}]'::jsonb, 3),
    ('System Management(CRUD)', 'It is a CRUD application and It was developed using php and phpmyadmin for a localhost.', 'crud.php', 'wide', array['PHP', 'MySQL', 'phpMyAdmin']::text[], '[{"src":"/media/crud2.png","alt":"CRUD system management web page"}]'::jsonb, '[{"type":"github","label":"Source Code","url":"https://github.com/Ronmar11/CRUD-website-with-phpadmin.git"},{"type":"youtube","label":"Project Demo","url":"https://youtu.be/XHw33qzDVyM"}]'::jsonb, 4)
) as v(title, description, file_name, media, tags, images, links, sort_order)
where not exists (select 1 from public.projects);

insert into public.video_projects (thumbnail_url, url, alt, sort_order)
select * from (values
    ('/media/vid1.png', 'https://www.facebook.com/reel/1194122799403154/?s=fb_shorts_profile&stack_idx=0', 'Project video 1 thumbnail', 0),
    ('/media/vid2.png', 'https://www.facebook.com/reel/1646689352673987/?s=fb_shorts_profile&stack_idx=0', 'Project video 2 thumbnail', 1),
    ('/media/vid3.png', 'https://www.facebook.com/reel/759842186554818/?s=fb_shorts_profile&stack_idx=0', 'Project video 3 thumbnail', 2),
    ('/media/vid4.png', 'https://www.facebook.com/reel/1273711777626748/?s=fb_shorts_profile&stack_idx=0', 'Project video 4 thumbnail', 3),
    ('/media/vid5.png', 'https://www.facebook.com/reel/1166808495268229/?s=fb_shorts_profile&stack_idx=0', 'Project video 5 thumbnail', 4),
    ('/media/vid6.png', 'https://www.facebook.com/reel/1217640869783728/?s=fb_shorts_profile&stack_idx=0', 'Project video 6 thumbnail', 5),
    ('/media/vid7.png', 'https://www.facebook.com/reel/891731700128443/?s=fb_shorts_profile&stack_idx=0', 'Project video 7 thumbnail', 6),
    ('/media/vid8.png', 'https://www.facebook.com/reel/1439877091134563/?s=fb_shorts_profile&stack_idx=0', 'Project video 8 thumbnail', 7),
    ('/media/vid9.png', 'https://www.facebook.com/reel/1391222805500781/?s=fb_shorts_profile&stack_idx=0', 'Project video 9 thumbnail', 8)
) as v(thumbnail_url, url, alt, sort_order)
where not exists (select 1 from public.video_projects);

insert into public.social_links (placement, label, icon_class, url, sort_order)
select * from (values
    ('hero', 'Facebook profile', 'ri-facebook-fill', 'https://www.facebook.com/ronmar.abalos/', 0),
    ('hero', 'GitHub profile', 'ri-github-fill', 'https://github.com/Ronmar11', 1),
    ('contact', 'LinkedIn profile', 'ri-linkedin-fill', 'https://www.linkedin.com/in/ronmar-ezekiel-abalos-85462a396/', 2),
    ('contact', 'Instagram profile', 'ri-instagram-line', 'https://www.instagram.com/zekiii.ee', 3),
    ('contact', 'GitHub profile', 'ri-github-fill', 'https://github.com/Ronmar11', 4)
) as v(placement, label, icon_class, url, sort_order)
where not exists (select 1 from public.social_links);
