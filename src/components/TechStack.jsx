import SectionTitle from './SectionTitle.jsx';
import SkillButton from './SkillButton.jsx';
import SectionQuote from './SectionQuote.jsx';
import { useContent } from '../content/ContentContext.jsx';
import { Stagger, StaggerItem } from './motion/Reveal.jsx';

export default function TechStack() {
  const { settings, skills } = useContent();

  return (
    <section id="TechStack">
      <div className="grid-pattern relative mx-[min(5rem,5%)] mb-[min(0.5rem,5%)] overflow-hidden px-[min(3rem,1%)] pb-[min(2rem,5%)] pt-[min(3rem,5%)]">
        <SectionTitle icon="stack" command="ls ./skills">
          {settings.techstack_title}
        </SectionTitle>

        <div className="h-full w-full transition-all duration-600 dark:text-[#f5f5f5]">
          {settings.techstack_quote.trim() && <SectionQuote>{settings.techstack_quote}</SectionQuote>}

          <Stagger
            stagger={0.04}
            className="m-[min(10px,3%)] flex flex-wrap justify-center gap-2.5 pt-[min(1rem,8%)] sm:m-[min(50px,8%)]"
          >
            {skills.map((skill) => (
              <StaggerItem key={skill.id}>
                <SkillButton skill={skill} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
