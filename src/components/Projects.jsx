import SectionTitle from './SectionTitle.jsx';
import ProjectCard from './ProjectCard.jsx';
import VideoProjects from './VideoProjects.jsx';
import GitHubContributions from './GitHubContributions.jsx';
import SectionQuote from './SectionQuote.jsx';
import { useContent } from '../content/ContentContext.jsx';
import { Reveal, Stagger, StaggerItem } from './motion/Reveal.jsx';

export default function Projects({ isDark }) {
  const { settings, projects, videoProjects } = useContent();

  return (
    <section id="projects">
      <div className="project-ring relative mx-[min(5rem,5%)] mb-[min(1rem,8%)] rounded-[28px] border border-transparent bg-transparent px-[min(3rem,1%)] py-[min(5rem,5%)] transition-[border-color] duration-600">
        <SectionTitle icon="projects" command="git log --projects">
          {settings.projects_title}
        </SectionTitle>

        {settings.projects_quote.trim() && <SectionQuote>{settings.projects_quote}</SectionQuote>}

        {settings.github_username.trim() && (
          <Reveal className="mx-auto mb-8 w-full max-w-[78rem] px-[min(50px,8%)]">
            {/* key: a new username starts a fresh fetch */}
            <GitHubContributions key={settings.github_username} username={settings.github_username.trim()} />
          </Reveal>
        )}

        {/* auto-rows-fr levels card heights per row, but only once there are rows */}
        <Stagger
          stagger={0.12}
          className="mx-auto grid w-full max-w-[78rem] grid-cols-1 gap-5 px-[min(50px,8%)] sm:auto-rows-fr sm:grid-cols-2 xl:grid-cols-3"
        >
          {projects.map((project) => (
            <StaggerItem key={project.id} className="h-full">
              <ProjectCard project={project} isDark={isDark} />
            </StaggerItem>
          ))}
        </Stagger>

        {videoProjects.length > 0 && (
          <VideoProjects caption={settings.videos_caption} videos={videoProjects} />
        )}
      </div>
    </section>
  );
}
