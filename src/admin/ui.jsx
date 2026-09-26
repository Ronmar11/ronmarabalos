// Small shared building blocks for the admin screens.

export const inputClass =
  'w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-black/35 focus:border-prime focus:ring-2 focus:ring-prime/25 disabled:opacity-60 dark:border-white/15 dark:bg-[#0d1117] dark:text-[#f5f5f5] dark:placeholder:text-white/30';

const buttonVariants = {
  primary: 'bg-prime text-white hover:bg-[#27997f] disabled:hover:bg-prime',
  secondary:
    'border border-black/15 bg-white text-ink hover:border-prime/50 hover:text-prime dark:border-white/15 dark:bg-white/5 dark:text-[#f5f5f5]',
  danger: 'border border-red-500/40 text-red-600 hover:bg-red-500/10 dark:text-red-400',
  ghost: 'text-black/60 hover:bg-black/5 hover:text-ink dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white',
};

export function Button({ variant = 'secondary', size = 'md', className = '', ...props }) {
  const sizing = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-4 py-2 text-sm';
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-mono font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prime/50 disabled:cursor-not-allowed disabled:opacity-50 ${sizing} ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  );
}

/** Label + control + help/error text, wired together for screen readers. */
export function FieldShell({ id, label, required, help, error, children }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block font-mono text-xs font-semibold text-black/70 dark:text-white/70">
        {label}
        {required && (
          <span className="ml-1 text-prime" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {help && !error && (
        <p id={`${id}-help`} className="text-xs text-black/50 dark:text-white/45">
          {help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

/** Inline status line; polite live region so screen readers announce it. */
export function StatusMessage({ status }) {
  if (!status) return <p aria-live="polite" className="sr-only" />;
  const tone =
    status.type === 'error'
      ? 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300'
      : 'border-prime/30 bg-prime/10 text-[#1f8a74] dark:text-prime';
  return (
    <p aria-live="polite" className={`rounded-lg border px-3 py-2 text-sm ${tone}`}>
      {status.message}
    </p>
  );
}

export function Card({ className = '', ...props }) {
  return (
    <div
      className={`rounded-xl border border-black/10 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.03] mob:p-6 ${className}`}
      {...props}
    />
  );
}

export function Spinner({ label = 'Loading' }) {
  return (
    <p className="flex items-center gap-2 font-mono text-sm text-black/50 dark:text-white/50">
      <span className="inline-block h-4 w-2 animate-blink bg-prime" aria-hidden="true" />
      {label}…
    </p>
  );
}
