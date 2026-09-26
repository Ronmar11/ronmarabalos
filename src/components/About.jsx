import SectionTitle from './SectionTitle.jsx';
import TerminalWindow from './TerminalWindow.jsx';
import { useContent } from '../content/ContentContext.jsx';
import { Reveal, Stagger, StaggerItem } from './motion/Reveal.jsx';

// Renders quickFacts as a syntax-coloured JS object literal.
function FactsSnippet({ quickFacts }) {
  return (
    <pre className="whitespace-pre-wrap break-words rounded-lg bg-[#0d1117] p-4 font-mono text-[12px] leading-relaxed text-[#c9d1d9] mob:text-[13px] dark:bg-black/50 dark:ring-1 dark:ring-white/10">
      <code>
        <span className="text-[#8b949e]">{'// quick facts'}</span>
        {'\n'}
        <span className="text-[#ff7b72]">const</span> <span className="text-[#d2a8ff]">ronmar</span>
        {' = {\n'}
        {quickFacts.map(({ id, key, value }) => (
          <span key={id}>
            {'  '}
            <span className="text-[#79c0ff]">{key}</span>
            {': '}
            <span className="text-[#a5d6ff]">&quot;{value}&quot;</span>
            {',\n'}
          </span>
        ))}
        {'};'}
      </code>
    </pre>
  );
}

export default function About() {
  const { settings, aboutParagraphs, quickFacts } = useContent();

  return (
    <section id="about">
      <div className="about-backdrop mx-5 mb-[min(5rem,5%)] rounded-b-[24px] px-2.5 pb-[min(2rem,5%)] tiny:mx-[min(5rem,5%)] tiny:rounded-b-[40px] tiny:px-[min(3rem,1%)]">
        <div className="h-full w-full px-3 pb-[min(2rem,10%)] pt-10 tiny:px-[min(3rem,8%)] tiny:pt-[min(6rem,10%)]">
          <SectionTitle icon="briefcase" command="cat about.md">
            {settings.about_title}
          </SectionTitle>

          {/* Single centred column -- there is no side illustration any more */}
          <Reveal className="mx-auto max-w-4xl">
            <TerminalWindow title="about.md" bodyClassName="p-4 mob:p-6 md:p-8">
              {/* Editor-style gutter, zero-indexed like an array: 00, 01, 02... */}
              <Stagger as="ol" stagger={0.1} className="space-y-4">
                {aboutParagraphs.map(({ id, text }, i) => (
                  <StaggerItem as="li" key={id} className="flex gap-3 mob:gap-4">
                    <span
                      className="select-none pt-[0.2em] font-mono text-xs text-black/30 dark:text-white/30"
                      aria-hidden="true"
                    >
                      {String(i).padStart(2, '0')}
                    </span>
                    <p className="text-[14px] leading-[1.6] mob:text-[clamp(15px,1.1vw,1.1rem)]">
                      {text}
                    </p>
                  </StaggerItem>
                ))}
              </Stagger>

              {quickFacts.length > 0 && (
                <Reveal delay={0.2} className="mt-6">
                  <FactsSnippet quickFacts={quickFacts} />
                </Reveal>
              )}
            </TerminalWindow>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
