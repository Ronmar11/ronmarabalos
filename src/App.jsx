import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { useDarkMode } from './hooks/useDarkMode.js';
import ScrollProgress from './components/motion/ScrollProgress.jsx';
import { ContentProvider } from './content/ContentContext.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import TechStack from './components/TechStack.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Chatbot from './components/Chatbot.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const [isDark, setIsDark] = useDarkMode();

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
            <ScrollProgress />
            <header>
              <Navbar isDark={isDark} onToggleDark={setIsDark} />
              <Hero isDark={isDark} />
            </header>

            <main>
              <About />
              <TechStack />
              <Projects isDark={isDark} />
              <Contact />
            </main>

            <Chatbot isDark={isDark} />
            <Footer />
          </div>
        </ContentProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
