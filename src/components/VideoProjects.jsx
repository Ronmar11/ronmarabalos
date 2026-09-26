import { safeUrl } from '../lib/safeUrl.js';
import { Reveal } from './motion/Reveal.jsx';

// Below this many reels a looping strip shows obvious repeats, so the row
// just sits still, centred.
const MIN_FOR_MARQUEE = 5;
const SECONDS_PER_REEL = 5; // loop speed: a calm ~35px per second

function Reel({ video, index, hidden }) {
  return (
    <li className="shrink-0">
      <a
        href={safeUrl(video.url)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={video.alt || `Video edit ${index + 1}`}
        // The second copy of the strip is decoration only: out of the Tab order.
        tabIndex={hidden ? -1 : undefined}
        className="group/reel relative block aspect-[9/16] w-32 overflow-hidden rounded-xl bg-black/5 ring-1 ring-black/10 transition-shadow duration-300 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prime mob:w-36 md:w-40 dark:bg-white/5 dark:ring-white/10"
      >
        <img
          src={safeUrl(video.thumbnail)}
          alt=""
          loading="lazy"
          draggable="false"
          className="h-full w-full object-cover transition-transform duration-500 group-hover/reel:scale-105"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 scale-90 items-center justify-center rounded-full bg-white/90 text-xl text-black opacity-0 shadow-lg transition-all duration-300 group-hover/reel:scale-100 group-hover/reel:opacity-100 group-focus-visible/reel:scale-100 group-focus-visible/reel:opacity-100"
        >
          <i className="ri-play-fill translate-x-[1px]" />
        </span>
      </a>
    </li>
  );
}

/** Video edits: one auto-scrolling filmstrip row instead of a tall grid. */
export default function VideoProjects({ title, caption, videos }) {
  const loops = videos.length >= MIN_FOR_MARQUEE;

  return (
    <Reveal className="mx-auto mt-14 w-full max-w-[78rem]">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <p className="font-mono text-xs text-prime">
            <span className="text-muted dark:text-muted-dark">~/ronmar $</span> ls ./reels
          </p>
          <h3 className="mt-1 text-xl font-bold tracking-tight mob:text-2xl">{title}</h3>
          {caption && <p className="mt-1 max-w-xl text-sm text-black/60 dark:text-white/60">{caption}</p>}
        </div>
        <p className="font-mono text-xs text-black/40 dark:text-white/40">
          {videos.length} reel{videos.length === 1 ? '' : 's'}
        </p>
      </div>

      {loops ? (
        // Edges fade out so reels drift in and out rather than being cut off.
        // Reduced motion: no animation, the duplicate copy is hidden, and the
        // row scrolls sideways by hand instead.
        <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] motion-reduce:overflow-x-auto motion-reduce:[mask-image:none]">
          <div
            className="flex w-max animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused] motion-reduce:animate-none"
            style={{ '--marquee-duration': `${videos.length * SECONDS_PER_REEL}s` }}
          >
            <ul className="flex gap-3 pr-3">
              {videos.map((video, i) => (
                <Reel key={video.id} video={video} index={i} />
              ))}
            </ul>
            <ul className="flex gap-3 pr-3 motion-reduce:hidden" aria-hidden="true">
              {videos.map((video, i) => (
                <Reel key={`${video.id}-copy`} video={video} index={i} hidden />
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <ul className="flex flex-wrap justify-center gap-3">
          {videos.map((video, i) => (
            <Reel key={video.id} video={video} index={i} />
          ))}
        </ul>
      )}
    </Reveal>
  );
}
