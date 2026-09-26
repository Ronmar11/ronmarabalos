import { useState } from 'react';
import { m } from 'framer-motion';
import { EASE, fadeUp } from './motion/Reveal.jsx';
import { VerifiedIcon } from './Icons.jsx';
import { useTypewriter } from '../hooks/useTypewriter.js';
import { useContent } from '../content/ContentContext.jsx';
import { safeUrl } from '../lib/safeUrl.js';

// The text column cascades in, one line after another, just after the portrait.
const column = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } },
};

export default function Hero({ isDark }) {
  const { settings, heroRoles, heroSocials } = useContent();
  // The portrait swaps to a second shot on hover, per theme.
  const [hovered, setHovered] = useState(false);
  const role = useTypewriter(heroRoles);
  const portrait = safeUrl(
    isDark
      ? hovered
        ? settings.portrait_night_hover
        : settings.portrait_night
      : hovered
        ? settings.portrait_day_hover
        : settings.portrait_day
  );

  return (
    <div className="profile-backdrop hero-grid z-[2] flex flex-col items-center justify-center gap-8 px-8 py-24 lg:flex-row lg:px-20 lg:pb-48 lg:pt-40">
      <m.div
        initial={{ opacity: 0, x: -40, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="portrait-mask rounded-q60 border border-white/[0.18] shadow-profile dark:border-[rgba(76,76,76,0.18)]"
      >
        <div
          role="img"
          aria-label={settings.hero_name}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={portrait ? { backgroundImage: `url("${portrait}")` } : undefined}
          className={`h-[23rem] w-[20rem] rounded-q60 bg-cover bg-no-repeat transition-all duration-600 mob:h-[30rem] mob:w-[28rem] ${
            hovered ? 'scale-[1.02]' : ''
          }`}
        />
      </m.div>

      <m.div variants={column} initial="hidden" animate="visible" className="flex flex-col items-center">
        <m.div variants={fadeUp} className="flex items-center justify-center">
          <h1 className="pr-[15px] text-[27px] font-bold xs:text-[30px] mob:text-[clamp(1rem,8vw,3rem)]">
            {settings.hero_name}
          </h1>
          <VerifiedIcon className="h-[50px] w-[50px] shrink-0 mob:h-16 mob:w-16" />
        </m.div>

        {/* Fixed height so the line doesn't jump as the text types in and out */}
        {heroRoles.length > 0 && (
          <m.p
            variants={fadeUp}
            className="mb-3 flex h-8 items-center font-mono text-[15px] mob:text-lg"
            aria-label={heroRoles.join(', ')}
          >
            <span className="mr-2 text-prime" aria-hidden="true">
              $
            </span>
            <span aria-hidden="true">{role}</span>
            <span className="ml-0.5 inline-block h-5 w-2.5 animate-blink bg-prime" aria-hidden="true" />
          </m.p>
        )}

        {settings.hero_tagline.trim() && (
          <m.p
            variants={fadeUp}
            className="pr-2 text-center text-[17px] mob:pr-0 mob:text-[clamp(20px,1.2vw,3rem)]"
          >
            {settings.hero_tagline}
          </m.p>
        )}

        {heroSocials.length > 0 && (
          <m.div variants={fadeUp} className="mt-5 flex flex-wrap items-center justify-center gap-5">
            {heroSocials.map((social) => (
              <a
                key={social.id}
                href={safeUrl(social.url)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="cursor-pointer rounded-[0.5em] border border-neu bg-neu px-[15px] py-2.5 text-[30px] text-neu-text shadow-neu transition-all duration-300 active:text-[#666] active:shadow-neu-inset dark:border-[#222] dark:bg-[#222] dark:text-[#f5f5f5] dark:shadow-neu-dark dark:active:shadow-neu-dark-inset"
              >
                <i className={social.iconClass} aria-hidden="true" />
              </a>
            ))}
          </m.div>
        )}
      </m.div>
    </div>
  );
}
