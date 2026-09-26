/**
 * A window frame with macOS-style traffic lights and a filename, used to give
 * content blocks an editor/terminal feel.
 */
export default function TerminalWindow({ title, children, className = '', bodyClassName = '' }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-black/10 bg-white/70 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)] backdrop-blur-sm dark:border-white/10 dark:bg-[#0d1117]/80 ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-black/10 bg-black/[0.04] px-4 py-2.5 dark:border-white/10 dark:bg-white/[0.03]">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        {title && (
          <span className="ml-2 truncate font-mono text-xs text-black/50 dark:text-white/50">
            {title}
          </span>
        )}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
