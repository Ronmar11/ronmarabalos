import { useRef, useState } from 'react';
import { navLinks } from '../data/navLinks.js';
import { SectionIcon } from './Icons.jsx';
import DarkModeToggle from './DarkModeToggle.jsx';
import { useIsScrolling } from '../hooks/useIsScrolling.js';

// The pill's original width. `cqw` resolves against the <nav> (the query
// container below), so the inner layer keeps full size while the pill shrinks
// around it -- and unlike vw it excludes the scrollbar, as `100%` used to.
const EXPANDED_WIDTH = 'w-[min(44rem,calc(100cqw-2rem))]';

function ThinkingDots() {
  return (
    <div className="flex items-center gap-[6px]">
      {['0.2s', '0.3s', '0.4s'].map((delay) => (
        <span
          key={delay}
          style={{ animationDelay: delay }}
          className="h-2 w-2 animate-dotPulse rounded-full bg-neu-text opacity-70 dark:bg-[#f5f5f5]"
        />
      ))}
    </div>
  );
}

export default function Navbar({ isDark, onToggleDark }) {
  const scrolling = useIsScrolling();
  const [hasFocus, setHasFocus] = useState(false);
  const pillRef = useRef(null);

  // Never collapse while a nav control is focused, or a keyboard user would
  // lose sight of where they are.
  const collapsed = scrolling && !hasFocus;

  const handleBlur = (event) => {
    // relatedTarget is the element receiving focus next.
    if (!pillRef.current?.contains(event.relatedTarget)) setHasFocus(false);
  };

  return (
    <nav className="fixed z-[100] mb-[min(5rem,8%)] mr-[min(5rem,8%)] mt-[min(1.7rem,8%)] flex h-[50px] w-full items-center justify-center [container-type:inline-size]">
      <div
        ref={pillRef}
        onFocusCapture={() => setHasFocus(true)}
        onBlurCapture={handleBlur}
        className={`nav-glass relative overflow-hidden rounded-q60 bg-white/[0.12] shadow-nav backdrop-blur-[3px] backdrop-saturate-[180%] transition-all duration-500 ${
          collapsed ? 'h-[38px] w-[84px]' : `h-[55px] ${EXPANDED_WIDTH}`
        }`}
      >
        {/* Collapsed state: the "thinking" dots */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            collapsed ? 'opacity-100 delay-150' : 'pointer-events-none opacity-0'
          }`}
        >
          <ThinkingDots />
        </div>

        {/* Expanded state: the real nav, held at full size so it never reflows */}
        <div
          className={`absolute left-1/2 top-1/2 flex h-[55px] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2.5 pl-4 pr-4 transition-opacity duration-200 xs:pr-10 mob:gap-5 md:gap-2.5 md:px-[4.7rem] ${EXPANDED_WIDTH} ${
            collapsed ? 'pointer-events-none opacity-0' : 'opacity-100 delay-100'
          }`}
        >
          {/* Full name on desktop, initials on mobile. The wrapper stays in the
              flow at every width -- as a zero-width flex child it still
              contributes one `gap`, which the original layout depends on. */}
          <div>
            <a
              href="#"
              className="hidden cursor-text whitespace-nowrap font-mono text-[14px] font-bold text-ink md:inline dark:text-[#f5f5f5]"
            >
              Ronmar Abalos
            </a>
          </div>
          <div className="flex md:hidden">
            <a
              href="#"
              className="pr-2 font-mono text-[12px] font-bold text-neu-text xs:pr-0 xs:text-[14px] dark:text-[#f5f5f5]"
            >
              RON
            </a>
          </div>

          {/* Desktop menu */}
          <ul className="hidden items-center px-[1%] md:flex md:gap-[15px] lg:gap-5">
            &#10073;
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className="font-mono text-[15px] font-medium text-ink transition-all duration-600 hover:text-prime dark:text-[#f5f5f5] dark:hover:text-prime"
                >
                  {link.label}
                </a>
              </li>
            ))}
            &#10073;
          </ul>

          {/* Mobile icon bar */}
          <div className="flex cursor-pointer gap-[25px] xs:gap-[35px] mob:gap-10 md:hidden">
            {navLinks.map((link) => (
              <div key={link.id} className="text-center transition-all duration-600">
                <a href={`#${link.id}`} className="text-ink dark:text-[#f5f5f5]">
                  <SectionIcon name={link.icon} className="mx-auto block h-5 w-5" />
                  <p className="m-0 text-[7px] font-semibold">{link.mobileLabel}</p>
                </a>
              </div>
            ))}
          </div>

          <DarkModeToggle isDark={isDark} onChange={onToggleDark} />
        </div>
      </div>
    </nav>
  );
}
