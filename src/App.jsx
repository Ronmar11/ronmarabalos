import SiteShell from './SiteShell.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import TechStack from './components/TechStack.jsx';
import Projects from './components/Projects.jsx';
import Contact from './components/Contact.jsx';
import Chatbot from './components/Chatbot.jsx';
import Footer from './components/Footer.jsx';

/** The landing page. */
export default function App() {
  return (
    <SiteShell>
      {({ isDark, setIsDark }) => (
        <>
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
        </>
      )}
    </SiteShell>
  );
}
