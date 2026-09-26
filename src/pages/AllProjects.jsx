import { useEffect } from 'react';
import SiteShell from '../SiteShell.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import DarkModeToggle from '../components/DarkModeToggle.jsx';
import Footer from '../components/Footer.jsx';
import { Stagger, StaggerItem } from '../components/motion/Reveal.jsx';
import { useContent } from '../content/ContentContext.jsx';
import { sitePath } from '../lib/sitePath.js';

function ProjectsList({ isDark, setIsDark }) {
  const { settings, projects } = useContent();

  useEffect(() => {
    document.title = `Projects · ${settings.hero_name}`;
  }, [settings.hero_name]);

  return (
    <>
      <header className="mx-auto flex w-full max-w-[78rem] items-center justify-between px-5 pt-6 md:px-8">
        <a
          href={sitePath('/')}
          className="group inline-flex items-center gap-2 font-mono text-sm text-black/60 transition-colors hover:text-prime dark:text-white/60"
        >
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          Back to home
        </a>
        <DarkModeToggle isDark={isDark} onChange={setIsDark} />
      </header>

      <main className="mx-auto w-full max-w-[78rem] px-5 pb-20 pt-12 md:px-8">
        <SectionTitle icon="projects" command="ls ./projects">
          All projects
        </SectionTitle>
        <p className="-mt-4 mb-10 text-center font-mono text-sm text-muted dark:text-muted-dark">
          {projects.length} project{projects.length === 1 ? '' : 's'}
        </p>

        {projects.length ? (
          // auto-rows-fr levels card heights per row, once there are rows
          <Stagger stagger={0.08} className="grid grid-cols-1 gap-5 sm:auto-rows-fr sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <StaggerItem key={project.id} className="h-full">
                <ProjectCard project={project} isDark={isDark} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : (
          <p className="text-center text-sm text-black/50 dark:text-white/50">No projects yet.</p>
        )}
      </main>

      <Footer />
    </>
  );
}

/** Every project, at /projects. The landing page shows only the featured three. */
export default function AllProjects() {
  return <SiteShell>{(shell) => <ProjectsList {...shell} />}</SiteShell>;
}
