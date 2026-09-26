import { safeUrl } from '../lib/safeUrl.js';
import { Reveal, Stagger, StaggerItem } from './motion/Reveal.jsx';

export default function VideoProjects({ caption, videos }) {
  return (
    <>
      <Reveal className="vids-divider relative mb-[min(50px,8%)] flex flex-wrap items-center justify-center pt-[50px]">
        <p className="w-[min(50rem,100%)] text-center text-[clamp(1.2rem,1.8vw,2.4rem)] font-semibold">
          {caption}
        </p>
      </Reveal>

      {/* Reels are portrait, so three per row keeps each one a sensible size */}
      <Stagger
        stagger={0.06}
        className="mx-auto grid max-w-[46rem] grid-cols-3 gap-2 px-[min(50px,8%)] mob:gap-3"
      >
        {videos.map((video) => (
          <StaggerItem key={video.id}>
            <a
              href={safeUrl(video.url)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={video.alt}
              className="group block aspect-[9/16] overflow-hidden rounded-lg bg-black/5 transition-transform duration-300 hover:scale-[1.02] dark:bg-white/5"
            >
              <img
                src={safeUrl(video.thumbnail)}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-all duration-300 group-hover:brightness-110"
              />
            </a>
          </StaggerItem>
        ))}
      </Stagger>
    </>
  );
}
