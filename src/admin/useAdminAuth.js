import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

/**
 * Tracks the Supabase session and whether it belongs to the admin.
 * status: 'loading' | 'signed-out' | 'checking' | 'admin' | 'forbidden'
 *
 * The UI gate here is only for convenience -- the real protection is the
 * database's row-level security, which checks admin_users on every write.
 */
export function useAdminAuth() {
  const [state, setState] = useState({ status: 'loading', user: null });

  useEffect(() => {
    let active = true;
    let checkedUserId = null;

    const resolve = async (session) => {
      if (!active) return;
      const user = session?.user ?? null;
      if (!user) {
        checkedUserId = null;
        setState({ status: 'signed-out', user: null });
        return;
      }
      // Token refreshes fire this again for the same user -- no need to re-check.
      if (user.id === checkedUserId) return;
      checkedUserId = user.id;
      setState({ status: 'checking', user });
      const { data, error } = await supabase.rpc('is_admin');
      if (!active || checkedUserId !== user.id) return;
      setState({ status: !error && data === true ? 'admin' : 'forbidden', user });
    };

    // Fires once immediately with the stored session (INITIAL_SESSION), then on
    // every sign-in/out. Supabase advises against awaiting other Supabase calls
    // inside this callback, so the admin check is deferred a tick.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => resolve(session), 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
