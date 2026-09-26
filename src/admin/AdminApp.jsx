import { useEffect, useState } from 'react';
import { isSupabaseConfigured, supabase, supabaseConfigProblem } from '../lib/supabase.js';
import { useDarkMode } from '../hooks/useDarkMode.js';
import DarkModeToggle from '../components/DarkModeToggle.jsx';
import { useAdminAuth } from './useAdminAuth.js';
import { COLLECTIONS } from './collections.js';
import CollectionEditor from './CollectionEditor.jsx';
import SettingsEditor from './SettingsEditor.jsx';
import Login from './Login.jsx';
import { Button, Card, Spinner } from './ui.jsx';

const SECTIONS = [
  { id: 'settings', label: 'Page text & photos', description: 'Your name, taglines, section headings, portrait photos and contact details.' },
  ...COLLECTIONS.map((c) => ({ id: c.id, label: c.label, description: c.description, collection: c })),
];

// The open section lives in the URL hash (#projects), so refresh keeps your place.
function useSectionFromHash() {
  const read = () => {
    const id = window.location.hash.slice(1);
    return SECTIONS.some((s) => s.id === id) ? id : SECTIONS[0].id;
  };
  const [section, setSection] = useState(read);
  useEffect(() => {
    const onHash = () => setSection(read());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return section;
}

function Shell({ children }) {
  const [isDark, setIsDark] = useDarkMode();
  useEffect(() => {
    document.title = 'Admin · Ronmar Abalos';
    // Keep the login page out of search results.
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex, nofollow';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);
  return (
    <div className="min-h-screen bg-[#f7f7f7] text-ink dark:bg-[#0a0a0a] dark:text-[#f5f5f5]">
      <div className="fixed right-4 top-4 z-50">
        <DarkModeToggle isDark={isDark} onChange={setIsDark} />
      </div>
      {children}
    </div>
  );
}

function SetupNotice() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Card className="space-y-4">
        <p className="font-mono text-xs text-prime">~/ronmar $ admin --status</p>
        <h1 className="text-2xl font-bold">Supabase isn&apos;t connected yet</h1>
        {/* Only show the specific reason once something has been filled in */}
        {(import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) && (
          <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
            {supabaseConfigProblem}
          </p>
        )}
        <p className="text-sm text-black/70 dark:text-white/70">
          The admin panel needs a Supabase project. Add these two lines to <code className="font-mono">.env</code> in the
          project folder, then restart <code className="font-mono">npm run dev</code>:
        </p>
        <pre className="overflow-x-auto rounded-lg bg-[#0d1117] p-4 font-mono text-xs text-[#c9d1d9]">
          {'VITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...'}
        </pre>
        <p className="text-sm text-black/70 dark:text-white/70">
          Both are in the Supabase dashboard under <strong>Project Settings → API Keys</strong>. Full setup steps are in{' '}
          <code className="font-mono">supabase/README.md</code>.
        </p>
      </Card>
    </main>
  );
}

function Forbidden({ email }) {
  return (
    <main className="mx-auto max-w-md px-4 py-24">
      <Card className="space-y-4 text-center">
        <h1 className="text-xl font-bold">No admin access</h1>
        <p className="text-sm text-black/70 dark:text-white/70">
          <span className="font-mono">{email}</span> is signed in, but isn&apos;t registered as the admin.
        </p>
        <Button onClick={() => supabase.auth.signOut()}>Sign out</Button>
      </Card>
    </main>
  );
}

function Dashboard({ user }) {
  const sectionId = useSectionFromHash();
  const section = SECTIONS.find((s) => s.id === sectionId);

  // On phones the section tabs scroll sideways; keep the active one visible.
  useEffect(() => {
    document.querySelector('nav[aria-label="Admin sections"] [aria-current="page"]')?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  }, [sectionId]);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 pt-6 lg:flex-row lg:gap-10 lg:pt-10">
      <aside className="lg:sticky lg:top-10 lg:h-fit lg:w-60 lg:shrink-0">
        <p className="font-mono text-xs text-prime">~/ronmar $ admin</p>
        <p className="mt-1 text-lg font-bold">Content</p>
        <nav aria-label="Admin sections" className="mt-4">
          <ul className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {SECTIONS.map((s) => {
              const active = s.id === sectionId;
              return (
                <li key={s.id} className="shrink-0">
                  <a
                    href={`#${s.id}`}
                    aria-current={active ? 'page' : undefined}
                    className={`block whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? 'bg-prime/15 font-semibold text-[#1f8a74] dark:text-prime'
                        : 'text-black/65 hover:bg-black/5 hover:text-ink dark:text-white/65 dark:hover:bg-white/10 dark:hover:text-white'
                    }`}
                  >
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-6 hidden space-y-3 border-t border-black/10 pt-4 dark:border-white/10 lg:block">
          <p className="truncate font-mono text-xs text-black/50 dark:text-white/50" title={user.email}>
            {user.email}
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-black/15 px-3 py-1 font-mono text-xs font-semibold hover:border-prime/50 hover:text-prime dark:border-white/15"
            >
              View site ↗
            </a>
            <Button size="sm" variant="ghost" onClick={() => supabase.auth.signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="mb-5">
          <h1 className="text-2xl font-bold">{section.label}</h1>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">{section.description}</p>
        </header>
        {/* key: switching sections remounts the editor with fresh state */}
        {section.collection ? (
          <CollectionEditor key={section.id} collection={section.collection} />
        ) : (
          <SettingsEditor key="settings" />
        )}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4 dark:border-white/10 lg:hidden">
          <span className="mr-auto truncate font-mono text-xs text-black/50 dark:text-white/50">{user.email}</span>
          <a href="/" className="font-mono text-xs font-semibold hover:text-prime">
            View site
          </a>
          <Button size="sm" variant="ghost" onClick={() => supabase.auth.signOut()}>
            Sign out
          </Button>
        </div>
      </main>
    </div>
  );
}

function ConnectedAdmin() {
  const { status, user } = useAdminAuth();
  if (status === 'loading' || status === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <Spinner label="Checking access" />
      </main>
    );
  }
  if (status === 'signed-out') return <Login />;
  if (status === 'forbidden') return <Forbidden email={user.email} />;
  return <Dashboard user={user} />;
}

export default function AdminApp() {
  return <Shell>{isSupabaseConfigured ? <ConnectedAdmin /> : <SetupNotice />}</Shell>;
}
