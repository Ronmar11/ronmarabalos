import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { safeUrl } from '../lib/safeUrl.js';
import { clearContentCache } from '../content/ContentContext.jsx';
import { DEFAULT_SETTINGS, SETTINGS_FIELDS, SETTINGS_GROUPS } from '../content/settings.js';
import { FormField } from './fields.jsx';
import { Button, Card, Spinner, StatusMessage } from './ui.jsx';

function validate(values) {
  const errors = {};
  for (const field of SETTINGS_FIELDS) {
    const value = values[field.key]?.trim() ?? '';
    if (field.type === 'image' && value && !safeUrl(value)) {
      errors[field.key] = 'Enter a full link starting with https:// (or a /media/… path).';
    }
  }
  if (!values.hero_name?.trim()) errors.hero_name = 'Your name is required.';
  const github = values.github_username?.trim();
  if (github && !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(github)) {
    errors.github_username = 'Just the username, e.g. Ronmar11 — not the full link.';
  }
  const email = values.contact_email?.trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.contact_email = 'That doesn’t look like an email address.';
  return errors;
}

export default function SettingsEditor() {
  const [saved, setSaved] = useState(null); // what's in the database
  const [values, setValues] = useState(null); // what's in the form
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoadError('');
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (error) {
      setLoadError(error.message);
      return;
    }
    const merged = { ...DEFAULT_SETTINGS };
    for (const { key, value } of data) if (key in merged) merged[key] = value;
    setSaved(merged);
    setValues(merged);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loadError) {
    return (
      <Card className="space-y-3">
        <StatusMessage status={{ type: 'error', message: `Could not load settings: ${loadError}` }} />
        <Button onClick={load}>Try again</Button>
      </Card>
    );
  }
  if (!values) return <Spinner label="Loading settings" />;

  const changedKeys = SETTINGS_FIELDS.map((f) => f.key).filter((key) => values[key] !== saved[key]);

  const save = async (event) => {
    event.preventDefault();
    const found = validate(values);
    if (Object.keys(found).length) {
      setErrors(found);
      setStatus({ type: 'error', message: 'Fix the highlighted fields first.' });
      return;
    }
    if (!changedKeys.length) return;
    setBusy(true);
    setStatus(null);
    try {
      const rows = changedKeys.map((key) => ({ key, value: values[key], updated_at: new Date().toISOString() }));
      const { data, error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' }).select();
      if (error) throw error;
      if (!data || data.length !== rows.length) {
        throw new Error('Not everything was saved — this account may not have admin access.');
      }
      clearContentCache();
      setSaved(values);
      setStatus({ type: 'success', message: `Saved ${rows.length} change${rows.length === 1 ? '' : 's'}.` });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not save.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} noValidate className="space-y-5">
      {SETTINGS_GROUPS.map((group) => (
        <Card key={group.title} className="space-y-4">
          <div>
            <h2 className="font-mono text-base font-bold">{group.title}</h2>
            {group.note && <p className="mt-1 text-xs text-black/50 dark:text-white/50">{group.note}</p>}
          </div>
          {group.fields.map((field) => (
            <FormField
              key={field.key}
              field={{ ...field, folder: 'site', rows: 3 }}
              value={values[field.key]}
              onChange={(value) => {
                setValues((current) => ({ ...current, [field.key]: value }));
                setErrors((current) => ({ ...current, [field.key]: undefined }));
                setStatus(null);
              }}
              error={errors[field.key]}
            />
          ))}
        </Card>
      ))}

      {/* Sticky so the save button is always in reach on this long form */}
      <div className="sticky bottom-0 -mx-1 space-y-2 border-t border-black/10 bg-[#f7f7f7]/95 px-1 py-3 backdrop-blur dark:border-white/10 dark:bg-[#0a0a0a]/95">
        <StatusMessage status={status} />
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" variant="primary" disabled={busy || !changedKeys.length}>
            {busy ? 'Saving…' : changedKeys.length ? `Save ${changedKeys.length} change${changedKeys.length === 1 ? '' : 's'}` : 'No changes'}
          </Button>
          {changedKeys.length > 0 && (
            <Button
              onClick={() => {
                setValues(saved);
                setErrors({});
                setStatus(null);
              }}
              disabled={busy}
            >
              Discard changes
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
