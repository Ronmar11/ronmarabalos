import { SectionIcon } from './Icons.jsx';
import { Reveal } from './motion/Reveal.jsx';

/**
 * Code-style section header: a shell prompt, the heading, an accent rule.
 * `command` is the text after the prompt, e.g. "cat about.md".
 */
export default function SectionTitle({ icon, command, children }) {
  return (
    <Reveal className="mb-[min(3rem,8%)] flex flex-col items-center gap-2 text-center">
      <p className="flex items-center gap-2 font-mono text-xs text-prime sm:text-sm">
        <SectionIcon name={icon} className="h-4 w-4" />
        <span>
          <span className="text-muted dark:text-muted-dark">~/ronmar $</span> {command}
        </span>
      </p>
      <h2 className="text-[clamp(1.6rem,2.6vw,2.4rem)] font-bold tracking-tight">
        {children}
      </h2>
      <span
        className="h-px w-24 bg-gradient-to-r from-transparent via-prime to-transparent"
        aria-hidden="true"
      />
    </Reveal>
  );
}
