import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { safeUrl } from '../lib/safeUrl.js';
import { clearContentCache } from '../content/ContentContext.jsx';
import { blankRow, validateRow } from './collections.js';
import { FormField } from './fields.jsx';
import { Button, Card, Spinner, StatusMessage } from './ui.jsx';

// Row-level security doesn't raise an error for a blocked update/delete -- it
// just affects zero rows. Treat that as a failure instead of a silent "saved".
function ensureAffected(data) {
  if (!data || (Array.isArray(data) && data.length === 0)) {
    throw new Error('Nothing was changed — this account may not have admin access. Try signing out and in again.');
  }
  return data;
}

const pickFields = (collection, values) =>
  Object.fromEntries(collection.fields.map((field) => [field.name, values[field.name]]));

function RowPreview({ summary }) {
  const image = safeUrl(summary.image);
  if (summary.icon) {
    return (
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-black/10 text-2xl dark:border-white/10">
        <i className={summary.icon} aria-hidden="true" />
      </span>
    );
  }
  if (image) {
    return (
      <img
        src={image}
        alt=""
        loading="lazy"
        className="h-12 w-12 shrink-0 rounded-lg border border-black/10 bg-black/5 object-cover dark:border-white/10"
      />
    );
  }
  return null;
}

export default function CollectionEditor({ collection }) {
  const [rows, setRows] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState(null); // { id?: string, values: object }
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirmingId, setConfirmingId] = useState(null);
  const formRef = useRef(null);

  const load = useCallback(async () => {
    setLoadError('');
    const { data, error } = await supabase
      .from(collection.table)
      .select('*')
      .order('sort_order')
      .order('created_at');
    if (error) {
      setLoadError(error.message);
      return;
    }
    setRows(data);
  }, [collection.table]);

  useEffect(() => {
    load();
  }, [load]);

  // Put the cursor in the first field whenever the form opens.
  useEffect(() => {
    if (editing) formRef.current?.querySelector('input, textarea, select')?.focus();
  }, [editing?.id, Boolean(editing)]); // eslint-disable-line react-hooks/exhaustive-deps

  const openNew = () => {
    setStatus(null);
    setErrors({});
    setEditing({ values: blankRow(collection) });
  };

  const openEdit = (row) => {
    setStatus(null);
    setErrors({});
    setEditing({ id: row.id, values: { ...blankRow(collection), ...pickFields(collection, row) } });
  };

  const closeForm = () => {
    setEditing(null);
    setErrors({});
  };

  const setValue = (name, value) => {
    setEditing((current) => ({ ...current, values: { ...current.values, [name]: value } }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  };

  const save = async (event) => {
    event.preventDefault();
    const found = validateRow(collection, editing.values);
    if (Object.keys(found).length) {
      setErrors(found);
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const payload = pickFields(collection, editing.values);
      if (editing.id) {
        const { data, error } = await supabase.from(collection.table).update(payload).eq('id', editing.id).select();
        if (error) throw error;
        ensureAffected(data);
      } else {
        const nextOrder = rows.reduce((max, row) => Math.max(max, row.sort_order ?? 0), -1) + 1;
        const { data, error } = await supabase
          .from(collection.table)
          .insert({ ...payload, sort_order: nextOrder })
          .select();
        if (error) throw error;
        ensureAffected(data);
      }
      clearContentCache();
      setStatus({ type: 'success', message: `${editing.id ? 'Saved' : 'Added'} — the live site shows it on the next page load.` });
      closeForm();
      await load();
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not save.' });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (row) => {
    setBusy(true);
    setStatus(null);
    try {
      const { data, error } = await supabase.from(collection.table).delete().eq('id', row.id).select();
      if (error) throw error;
      ensureAffected(data);
      clearContentCache();
      setStatus({ type: 'success', message: 'Deleted.' });
      setConfirmingId(null);
      await load();
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not delete.' });
    } finally {
      setBusy(false);
    }
  };

  // Swap with a neighbour, then renumber only the rows whose position changed.
  const move = async (index, delta) => {
    const next = [...rows];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    const changed = next.map((row, i) => ({ row, i })).filter(({ row, i }) => row.sort_order !== i);
    setRows(next.map((row, i) => ({ ...row, sort_order: i }))); // optimistic
    setBusy(true);
    setStatus(null);
    try {
      const results = await Promise.all(
        changed.map(({ row, i }) => supabase.from(collection.table).update({ sort_order: i }).eq('id', row.id).select())
      );
      for (const { data, error } of results) {
        if (error) throw error;
        ensureAffected(data);
      }
      clearContentCache();
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Could not reorder.' });
      await load();
    } finally {
      setBusy(false);
    }
  };

  if (loadError) {
    return (
      <Card className="space-y-3">
        <StatusMessage status={{ type: 'error', message: `Could not load ${collection.label.toLowerCase()}: ${loadError}` }} />
        <Button onClick={load}>Try again</Button>
      </Card>
    );
  }
  if (!rows) return <Spinner label={`Loading ${collection.label.toLowerCase()}`} />;

  // ----- Add / edit form ---------------------------------------------------
  if (editing) {
    return (
      <Card>
        <form
          ref={formRef}
          onSubmit={save}
          onKeyDown={(e) => e.key === 'Escape' && !busy && closeForm()}
          noValidate
          className="space-y-5"
        >
          <h2 className="font-mono text-lg font-bold">
            {editing.id ? `Edit ${collection.itemName}` : `New ${collection.itemName}`}
          </h2>
          {collection.fields.map((field) => (
            <FormField
              key={field.name}
              field={field}
              value={editing.values[field.name]}
              onChange={(value) => setValue(field.name, value)}
              error={errors[field.name]}
            />
          ))}
          <StatusMessage status={status} />
          <div className="flex flex-wrap gap-2 border-t border-black/10 pt-4 dark:border-white/10">
            <Button type="submit" variant="primary" disabled={busy}>
              {busy ? 'Saving…' : editing.id ? 'Save changes' : `Add ${collection.itemName}`}
            </Button>
            <Button onClick={closeForm} disabled={busy}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    );
  }

  // ----- List --------------------------------------------------------------
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-black/50 dark:text-white/50">
          {rows.length} {rows.length === 1 ? collection.itemName : `${collection.itemName}s`}
        </p>
        <Button variant="primary" onClick={openNew} disabled={busy}>
          + Add {collection.itemName}
        </Button>
      </div>

      <StatusMessage status={status} />

      {rows.length === 0 ? (
        <Card className="text-center text-sm text-black/50 dark:text-white/50">
          Nothing here yet — this section is hidden on the site until you add something.
        </Card>
      ) : (
        <ol className="space-y-2">
          {rows.map((row, index) => {
            const summary = collection.summary(row);
            const title = summary.title || `Untitled ${collection.itemName}`;
            return (
              <li
                key={row.id}
                className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white/80 p-3 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span className="w-6 shrink-0 text-center font-mono text-xs text-black/35 dark:text-white/35">
                    {String(index).padStart(2, '0')}
                  </span>
                  <RowPreview summary={summary} />
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-semibold">{title}</p>
                    {summary.subtitle && (
                      <p className="truncate font-mono text-xs text-black/50 dark:text-white/50">{summary.subtitle}</p>
                    )}
                  </div>
                </div>

                {confirmingId === row.id ? (
                  <div className="flex items-center gap-2" role="group" aria-label={`Confirm deleting ${title}`}>
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">Delete for good?</span>
                    <Button size="sm" variant="danger" onClick={() => remove(row)} disabled={busy}>
                      Yes, delete
                    </Button>
                    <Button size="sm" onClick={() => setConfirmingId(null)} disabled={busy}>
                      Keep
                    </Button>
                  </div>
                ) : (
                  <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => move(index, -1)}
                      disabled={busy || index === 0}
                      aria-label={`Move ${title} up`}
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => move(index, 1)}
                      disabled={busy || index === rows.length - 1}
                      aria-label={`Move ${title} down`}
                    >
                      ↓
                    </Button>
                    <Button size="sm" onClick={() => openEdit(row)} disabled={busy}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setConfirmingId(row.id)} disabled={busy}>
                      Delete
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
