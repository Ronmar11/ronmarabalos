import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { Button, FieldShell, StatusMessage, inputClass } from './ui.jsx';
import TerminalWindow from '../components/TerminalWindow.jsx';
import { sitePath } from '../lib/sitePath.js';

// The same message for "no such user" and "wrong password", so the form
// doesn't reveal which usernames exist.
const GENERIC_ERROR = 'Wrong username or password.';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      // Supabase signs in by email; a plain username is looked up first.
      let email = identifier.trim();
      if (!email.includes('@')) {
        const { data, error: lookupError } = await supabase.rpc('admin_login_email', { p_username: email });
        if (lookupError) throw lookupError;
        if (!data) {
          setError(GENERIC_ERROR);
          return;
        }
        email = data;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        setError(/invalid login credentials/i.test(signInError.message) ? GENERIC_ERROR : signInError.message);
      }
      // On success, useAdminAuth picks up the new session and swaps the screen.
    } catch (err) {
      setError(err.message || 'Could not sign in. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <TerminalWindow title="admin@portfolio: ~/login" className="w-full max-w-sm" bodyClassName="p-6">
        <form onSubmit={submit} noValidate className="space-y-5">
          <div>
            <p className="font-mono text-xs text-prime">~/ronmar $ sudo login</p>
            <h1 className="mt-1 text-xl font-bold">Admin sign in</h1>
          </div>

          <FieldShell id="login-identifier" label="Username">
            <input
              id="login-identifier"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck="false"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className={inputClass}
            />
          </FieldShell>

          <FieldShell id="login-password" label="Password">
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          </FieldShell>

          <StatusMessage status={error ? { type: 'error', message: error } : null} />

          <Button type="submit" variant="primary" disabled={busy} className="w-full">
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>

          <a href={sitePath('/')} className="block text-center font-mono text-xs text-black/50 hover:text-prime dark:text-white/50">
            ← back to the site
          </a>
        </form>
      </TerminalWindow>
    </main>
  );
}
