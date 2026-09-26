import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { useDarkMode } from './hooks/useDarkMode.js';
import { useSmoothScroll } from './hooks/useSmoothScroll.js';
import { ContentProvider } from './content/ContentContext.jsx';

/**
 * Everything the public pages share: theme, smooth scrolling, animation
 * setup and site content. `children` is a function given { isDark, setIsDark }.
 */
export default function SiteShell({ children }) {
  const [isDark, setIsDark] = useDarkMode();
  useSmoothScroll();

  return (
    // LazyMotion + domAnimation loads only the DOM animation features the site
    // uses, so components use the lightweight `m.*` instead of `motion.*`.
    // `strict` makes an accidental `motion.*` fail loudly rather than quietly
    // pulling the full bundle back in.
    <LazyMotion features={domAnimation} strict>
      {/* reducedMotion="user": honour the OS "reduce motion" setting --
          movement is skipped, opacity fades still run. */}
      <MotionConfig reducedMotion="user">
        {/* Page content comes from Supabase (see src/content), editable at /admin */}
        <ContentProvider>
          <div className="min-h-screen w-full overflow-x-clip overflow-y-visible">
            {children({ isDark, setIsDark })}
          </div>
        </ContentProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
