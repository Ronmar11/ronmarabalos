import SectionTitle from './SectionTitle.jsx';
import SectionQuote from './SectionQuote.jsx';
import VideoProjects from './VideoProjects.jsx';
import GitHubContributions from './GitHubContributions.jsx';
import ProjectDeck from './ProjectDeck.jsx';
import { useContent } from '../content/ContentContext.jsx';
import { Reveal } from './motion/Reveal.jsx';
import { sitePath } from '../lib/sitePath.js';

const LANDING_LIMIT = 3;

export default function Projects({ isDark }) {
  const { settings, projects, videoProjects } = useContent();

  // The projects ticked "Show on the landing page" in /admin. Until any are
  // ticked, the first three stand in so the section is never empty.
  const featured = projects.filter((p) => p.featured);
  const shown = (featured.length ? featured : projects).slice(0, LANDING_LIMIT);

  return (
    <section id="projects">
      <div className="relative mx-[min(5rem,5%)] mb-[min(1rem,8%)] px-[min(3rem,1%)] py-[min(5rem,5%)]">
        {shown.length > 0 && (
          <Reveal className="mx-auto w-full max-w-[78rem]">
            <ProjectDeck projects={shown} isDark={isDark}>
              <SectionTitle icon="projects" command="git log --projects">
                {settings.projects_title}
              </SectionTitle>
              {settings.projects_quote.trim() && <SectionQuote>{settings.projects_quote}</SectionQuote>}
            </ProjectDeck>

            <div className="mt-6 flex justify-center">
              <a
                href={sitePath('/projects')}
                className="group font-mono text-xs uppercase tracking-[0.18em] text-black/50 transition-colors hover:text-prime dark:text-white/50 dark:hover:text-prime"
              >
                View all projects{' '}
                <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </Reveal>
        )}

        {settings.github_username.trim() && (
          <Reveal className="mx-auto mt-10 w-full max-w-[78rem]">
            {/* key: a new username starts a fresh fetch */}
            <GitHubContributions key={settings.github_username} username={settings.github_username.trim()} />
          </Reveal>
        )}

        {videoProjects.length > 0 && (
          <VideoProjects title={settings.videos_title} caption={settings.videos_caption.trim()} videos={videoProjects} />
        )}
      </div>
    </section>
  );
}
