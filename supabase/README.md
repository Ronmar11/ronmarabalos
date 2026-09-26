# Admin panel setup (Supabase)

The site's content lives in Supabase and is edited at **`/admin`**. Until
Supabase is connected, the site shows its built-in content and `/admin` shows
setup instructions — nothing breaks.

Setup takes about 10 minutes and is done once.

## 1. Create the project

1. Sign in at [supabase.com](https://supabase.com) → **New project**. Any name
   and region; save the database password somewhere safe (you won't need it
   for the site).
2. Wait for it to finish provisioning.

## 2. Create the tables and security rules

In the dashboard: **SQL Editor → New query**. Paste and **Run** each file, in
this order:

| File | What it does |
| --- | --- |
| `schema.sql` | Creates the content tables, the image bucket, and the rules that let anyone *read* but only you *write*. |
| `seed.sql` | Copies everything currently on the site into the database. |

Both are safe to run again later — they never duplicate or overwrite content.

## 3. Create your admin login

1. **Authentication → Users → Add user → Create new user.** Enter your email
   and a strong password, and tick **Auto Confirm User**.
2. Open `create-admin.sql`, change the **username** and **email** to yours, then
   paste and run it in the SQL Editor. It should print one row.
3. **Authentication → Sign In / Providers →** turn **off**
   *Allow new users to sign up*.

## 4. Connect the site

**Project Settings → API Keys.** Copy the project URL and the **publishable**
key (or the legacy **anon** key) into `.env` in the project folder:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Restart `npm run dev`, open <http://localhost:5173/admin>, and sign in with the
username and password from step 3.

> These two values are safe to expose in the browser — that's what they're
> for. Never put the **secret** / **service_role** key in this project.

## 5. When you deploy

Add the same two `VITE_…` variables in your host's environment settings, then
redeploy.

`/admin` and `/projects` are pages of the app, not files, so the host must
serve `index.html` for them:

- **Vercel:** already set up by `vercel.json` in the project root.
- **Netlify:** add `public/_redirects` containing `/*  /index.html  200`

On Vercel, add the two variables under **Project Settings → Environment
Variables** (tick Production and Preview), then **redeploy** — Vite bakes them
in at build time, so an existing deployment won't pick them up.

## How the security works

- Visitors can **read** every content table (the public site needs to).
- **Writes** require a signed-in account that is listed in `admin_users`.
  This is enforced inside the database by row-level security, so it holds
  even if someone skips the admin UI and calls the API directly. A stranger
  who somehow created an account still cannot change anything.
- `admin_users` itself is not readable through the API.
- The login form accepts your username: it looks up your login email from it.
  That email is already public on the site, and the password is still required
  (Supabase rate-limits sign-in attempts).
- Uploaded images go to the public `portfolio` bucket (5 MB max, images only);
  only the admin can upload or delete.

## Editing content

| Admin section | Controls |
| --- | --- |
| Page text & photos | Name, greeting, status line, tagline, portrait photos, section headings and taglines, contact email, location, footer |
| Tech stack | Skill buttons (icon class or image) |
| Projects | Cards: title, description, tags, screenshots (light + dark), links, layout |
| About paragraphs | The numbered paragraphs |
| Quick facts | The `const ronmar = { … }` block |
| Hero roles | The phrases typed under your name |
| Video reels | Reel thumbnails and links |
| Social links | Icon buttons in the hero and contact section |

Changes appear on the live site on the next page load. Returning visitors see
their cached copy for a moment first, then the update.

Emptying a list hides that part of the page (for example, deleting every
video reel hides the reels block).

The chatbot's knowledge of you is separate — it lives in
`server/persona.js`, not in the database.
