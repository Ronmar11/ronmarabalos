import { MonitorIcon } from './Icons.jsx';
import { safeUrl } from '../lib/safeUrl.js';

const linkIconClass = {
  github: 'ri-github-fill',
  youtube: 'fa-brands fa-youtube',
  demo: 'ri-external-link-line',
  appstore: 'ri-apple-fill',
  playstore: 'ri-google-play-fill',
  link: 'ri-link',
};

/** One screenshot, picking the light or dark variant when the card has both. */
function Shot({ image, isDark, className }) {
  return (
    <img
      src={safeUrl(isDark && image.darkSrc ? image.darkSrc : image.src)}
      alt={image.alt}
      loading="lazy"
      className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.03] ${className}`}
    />
  );
}

function PreviewContent({ project, isDark }) {
  if (!project.images.length) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-xs text-black/40 dark:text-white/40">
        no preview
      </div>
    );
  }

  if (project.media === 'dual') {
    const [main, side] = project.images;
    return (
      <div className="flex h-full gap-1.5 p-1.5">
        <div className="basis-[72%] overflow-hidden rounded">
          <Shot image={main} isDark={isDark} className="object-cover object-top" />
        </div>
        <div className="flex-1 overflow-hidden rounded">
          <Shot image={side} isDark={isDark} className="object-cover object-top" />
        </div>
      </div>
    );
  }

  // A 9:20 phone screenshot would crop to a sliver, so fit it whole instead.
  if (project.media === 'portrait') {
    return (
      <div className="h-full p-2">
        <Shot image={project.images[0]} isDark={isDark} className="object-contain" />
      </div>
    );
  }

  return <Shot image={project.images[0]} isDark={isDark} className="object-cover object-top" />;
}

/** Fixed-ratio preview in a window frame, so every card lines up. */
function Preview({ project, isDark }) {
  return (
    <div className="overflow-hidden rounded-lg border border-black/15 dark:border-white/10">
      <div className="flex items-center gap-1.5 border-b border-black/10 bg-black/[0.04] px-3 py-2 dark:border-white/10 dark:bg-white/[0.04]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
        {project.file && (
          <span className="ml-2 truncate font-mono text-[11px] text-black/50 dark:text-white/50">
            {project.file}
          </span>
        )}
      </div>
      <div className="relative aspect-[16/10] overflow-hidden bg-[#efefef] dark:bg-[#141414]">
        <PreviewContent project={project} isDark={isDark} />
      </div>
    </div>
  );
}

/**
 * `solid`: opaque surface, for cards stacked on top of each other (the carousel).
 * `interactive`: false takes the links out of the Tab order (cards at the back).
 */
export default function ProjectCard({ project, isDark, solid = false, interactive = true }) {
  const surface = solid
    ? 'bg-white dark:bg-[#13151b]'
    : 'bg-white/[0.05] backdrop-blur-[8px] dark:bg-white/[0.03]';

  return (
    <article
      className={`group flex h-full flex-col gap-4 rounded-xl border border-neu p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-prime/40 hover:shadow-card-hover dark:border-white/10 dark:hover:border-prime/40 ${surface}`}
    >
      <Preview project={project} isDark={isDark} />

      <div className="flex flex-1 flex-col gap-2">
        {/* items-start keeps the icon on the first line when a title wraps */}
        <h3 className="flex items-start gap-2 text-[clamp(1.05rem,1.4vw,1.35rem)] font-bold leading-snug">
          <MonitorIcon className="mt-[0.15em] shrink-0 text-prime" />
          {project.title}
        </h3>

        <p className="text-[15px] leading-relaxed text-black/70 dark:text-white/70">
          {project.description}
        </p>

        {project.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 pt-1" aria-label="Built with">
            {project.tags.map((tag, i) => (
              <li
                key={`${i}-${tag}`}
                className="rounded-md bg-prime/10 px-2 py-0.5 font-mono text-[11px] font-medium text-[#1f8a74] dark:text-prime"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* mt-auto pins the links to the bottom so every card ends level */}
        <div className="mt-auto flex flex-wrap gap-2 pt-3">
          {project.links.map((link, i) => (
            <a
              key={`${i}-${link.url}`}
              href={safeUrl(link.url)}
              tabIndex={interactive ? undefined : -1}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-1.5 font-mono text-[12px] font-semibold text-gray-500 transition-colors duration-300 hover:border-prime/40 hover:bg-prime/10 hover:text-black dark:border-white/10 dark:hover:text-white"
            >
              <i className={`${linkIconClass[link.type] ?? linkIconClass.link} text-[16px]`} aria-hidden="true" />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
