import { useId, useRef, useState } from 'react';
import { Button, FieldShell, inputClass } from './ui.jsx';
import { uploadImage } from './storage.js';
import { safeUrl } from '../lib/safeUrl.js';

export const LINK_TYPES = [
  { value: 'github', label: 'GitHub (source code)' },
  { value: 'youtube', label: 'YouTube (demo video)' },
  { value: 'demo', label: 'Live demo' },
  { value: 'link', label: 'Other link' },
];

/** Image URL box + upload button + preview. Either way, the value is a URL. */
export function ImageInput({ id, value, onChange, folder, describedBy }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const preview = safeUrl(value);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // allow choosing the same file again
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      onChange(await uploadImage(file, folder));
    } catch (error) {
      setUploadError(error.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          inputMode="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /media/file.png"
          aria-describedby={describedBy}
          className={inputClass}
        />
        <Button onClick={() => fileRef.current?.click()} disabled={uploading} className="shrink-0">
          {uploading ? 'Uploading…' : 'Upload'}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          onChange={handleFile}
          className="hidden"
          aria-label="Choose an image to upload"
        />
      </div>
      {uploadError && (
        <p role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
          {uploadError}
        </p>
      )}
      {preview && (
        <img
          src={preview}
          alt=""
          className="h-20 max-w-[12rem] rounded-md border border-black/10 bg-black/5 object-contain dark:border-white/10 dark:bg-white/5"
        />
      )}
    </div>
  );
}

/** Comma-separated text box that stores an array. */
function TagsInput({ id, value, onChange, describedBy, placeholder }) {
  // Keep the raw text locally so typing "React, " isn't trimmed mid-word.
  const [text, setText] = useState((value ?? []).join(', '));
  return (
    <div className="space-y-2">
      <input
        id={id}
        type="text"
        value={text}
        placeholder={placeholder}
        aria-describedby={describedBy}
        onChange={(e) => {
          setText(e.target.value);
          onChange(
            e.target.value
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          );
        }}
        className={inputClass}
      />
      {value?.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Tags preview">
          {value.map((tag, i) => (
            <li key={`${i}-${tag}`} className="rounded-md bg-prime/10 px-2 py-0.5 font-mono text-[11px] text-[#1f8a74] dark:text-prime">
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Shared chrome for a repeatable list of sub-items (screenshots, links). */
function RepeatableList({ items, onChange, empty, addLabel, blank, renderItem, itemName }) {
  const update = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const move = (index, delta) => {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && <p className="text-xs text-black/50 dark:text-white/45">{empty}</p>}
      {items.map((item, index) => (
        <fieldset key={index} className="space-y-3 rounded-lg border border-black/10 p-3 dark:border-white/10">
          <legend className="px-1 font-mono text-[11px] text-black/50 dark:text-white/50">
            {itemName} {index + 1}
          </legend>
          {renderItem(item, (patch) => update(index, patch), index)}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" onClick={() => move(index, -1)} disabled={index === 0}>
              ↑ Up
            </Button>
            <Button size="sm" variant="ghost" onClick={() => move(index, 1)} disabled={index === items.length - 1}>
              ↓ Down
            </Button>
            <Button size="sm" variant="danger" onClick={() => remove(index)}>
              Remove
            </Button>
          </div>
        </fieldset>
      ))}
      <Button size="sm" onClick={() => onChange([...items, { ...blank }])}>
        + {addLabel}
      </Button>
    </div>
  );
}

function SubField({ label, children, id }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block font-mono text-[11px] text-black/60 dark:text-white/60">
        {label}
      </label>
      {children}
    </div>
  );
}

function ImagesInput({ value, onChange, folder }) {
  const baseId = useId();
  return (
    <RepeatableList
      items={value ?? []}
      onChange={onChange}
      itemName="Screenshot"
      empty="No screenshots yet — the card will show a “no preview” box."
      addLabel="Add screenshot"
      blank={{ src: '', dark_src: '', alt: '' }}
      renderItem={(item, patch, index) => (
        <>
          <SubField id={`${baseId}-${index}-src`} label="Image (light mode) *">
            <ImageInput id={`${baseId}-${index}-src`} value={item.src ?? ''} onChange={(src) => patch({ src })} folder={folder} />
          </SubField>
          <SubField id={`${baseId}-${index}-dark`} label="Image for dark mode (optional)">
            <ImageInput
              id={`${baseId}-${index}-dark`}
              value={item.dark_src ?? ''}
              onChange={(dark_src) => patch({ dark_src })}
              folder={folder}
            />
          </SubField>
          <SubField id={`${baseId}-${index}-alt`} label="Description for screen readers">
            <input
              id={`${baseId}-${index}-alt`}
              type="text"
              value={item.alt ?? ''}
              onChange={(e) => patch({ alt: e.target.value })}
              placeholder="e.g. Dashboard showing monthly sales"
              className={inputClass}
            />
          </SubField>
        </>
      )}
    />
  );
}

function LinksInput({ value, onChange }) {
  const baseId = useId();
  return (
    <RepeatableList
      items={value ?? []}
      onChange={onChange}
      itemName="Link"
      empty="No links yet."
      addLabel="Add link"
      blank={{ type: 'github', label: 'Source Code', url: '' }}
      renderItem={(item, patch, index) => (
        <div className="grid gap-3 sm:grid-cols-2">
          <SubField id={`${baseId}-${index}-type`} label="Type">
            <select
              id={`${baseId}-${index}-type`}
              value={item.type ?? 'link'}
              onChange={(e) => patch({ type: e.target.value })}
              className={inputClass}
            >
              {LINK_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </SubField>
          <SubField id={`${baseId}-${index}-label`} label="Button text">
            <input
              id={`${baseId}-${index}-label`}
              type="text"
              value={item.label ?? ''}
              onChange={(e) => patch({ label: e.target.value })}
              className={inputClass}
            />
          </SubField>
          <div className="sm:col-span-2">
            <SubField id={`${baseId}-${index}-url`} label="URL *">
              <input
                id={`${baseId}-${index}-url`}
                type="url"
                value={item.url ?? ''}
                onChange={(e) => patch({ url: e.target.value })}
                placeholder="https://"
                className={inputClass}
              />
            </SubField>
          </div>
        </div>
      )}
    />
  );
}

/** Renders the right control for a field definition from collections.js. */
export function FormField({ field, value, onChange, error }) {
  const id = useId();
  const describedBy = error ? `${id}-error` : field.help ? `${id}-help` : undefined;
  // The visual asterisk is aria-hidden, so announce "required" explicitly.
  const common = {
    id,
    'aria-describedby': describedBy,
    'aria-invalid': Boolean(error) || undefined,
    'aria-required': field.required || undefined,
  };

  let control;
  switch (field.type) {
    case 'textarea':
      control = (
        <textarea
          {...common}
          rows={field.rows ?? 4}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          className={`${inputClass} resize-y`}
        />
      );
      break;
    case 'select':
      control = (
        <select {...common} value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={inputClass}>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
      break;
    case 'image':
      control = (
        <ImageInput id={id} value={value ?? ''} onChange={onChange} folder={field.folder} describedBy={describedBy} />
      );
      break;
    case 'icon':
      control = (
        <div className="flex items-center gap-3">
          <input
            {...common}
            type="text"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={inputClass}
          />
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-black/10 text-2xl dark:border-white/10">
            {value ? <i className={value} aria-hidden="true" /> : <span className="text-xs text-black/30">—</span>}
          </span>
        </div>
      );
      break;
    case 'tags':
      control = (
        <TagsInput id={id} value={value ?? []} onChange={onChange} describedBy={describedBy} placeholder={field.placeholder} />
      );
      break;
    case 'images':
      control = <ImagesInput value={value ?? []} onChange={onChange} folder={field.folder} />;
      break;
    case 'links':
      control = <LinksInput value={value ?? []} onChange={onChange} />;
      break;
    default:
      control = (
        <input
          {...common}
          type={field.type === 'url' ? 'url' : 'text'}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          className={inputClass}
        />
      );
  }

  return (
    <FieldShell id={id} label={field.label} required={field.required} help={field.help} error={error}>
      {control}
    </FieldShell>
  );
}
