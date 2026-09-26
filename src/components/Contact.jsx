import SectionTitle from './SectionTitle.jsx';
import SectionQuote from './SectionQuote.jsx';
import TerminalWindow from './TerminalWindow.jsx';
import { useTapActive } from '../hooks/useTapActive.js';
import { Reveal } from './motion/Reveal.jsx';
import { useContent } from '../content/ContentContext.jsx';
import { safeUrl } from '../lib/safeUrl.js';

// "Ronmar Abalos" -> "ronmar-abalos", for the terminal's `whoami` output.
const toHandle = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export default function Contact() {
  const { settings, contactSocials } = useContent();
  const [ctaActive, toggleCta] = useTapActive();
  const email = settings.contact_email.trim();
  const mailto = email ? safeUrl(`mailto:${email}`) : '';

  // Each entry is one prompt + its output in the contact terminal.
  const session = [
    { command: 'whoami', output: toHandle(settings.hero_name) },
    email && { command: 'contact --email', output: email, href: mailto },
    settings.contact_location.trim() && { command: 'location', output: settings.contact_location },
  ].filter(Boolean);

  return (
    <section id="contact">
      <div className="mx-[min(5rem,5%)] px-[min(3rem,1%)] pb-[min(6rem,8%)] pt-[min(3rem,5%)]">
        <SectionTitle icon="link" command="./contact.sh">
          {settings.contact_title}
        </SectionTitle>

        {settings.contact_quote.trim() && <SectionQuote>{settings.contact_quote}</SectionQuote>}

        <Reveal className="mx-auto max-w-xl">
          <TerminalWindow
            title="ronmar@portfolio: ~"
            bodyClassName="space-y-3 p-4 font-mono text-[13px] mob:p-5 mob:text-sm"
          >
            {session.map((line) => (
              <div key={line.command}>
                <p>
                  <span className="text-prime">~/ronmar $</span> {line.command}
                </p>
                {line.href ? (
                  <a
                    href={line.href}
                    className="break-all text-black/60 underline decoration-prime/40 underline-offset-4 transition-colors hover:text-prime dark:text-white/60"
                  >
                    {line.output}
                  </a>
                ) : (
                  <p className="text-black/60 dark:text-white/60">{line.output}</p>
                )}
              </div>
            ))}
            <p aria-hidden="true">
              <span className="text-prime">~/ronmar $</span>{' '}
              <span className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-prime" />
            </p>
          </TerminalWindow>
        </Reveal>

        {/* Primary call to action */}
        {mailto && (
          <Reveal delay={0.15} className="mt-8 flex justify-center">
            <a
              href={mailto}
              onClick={toggleCta}
              className={`cta-button relative cursor-pointer rounded-[16px] border-none p-[2px] text-[1.2rem] mob:text-[1.4rem] ${
                ctaActive ? 'is-active' : ''
              }`}
            >
              <div className="cta-blob" aria-hidden="true" />
              <div className="cta-inner rounded-[14px] px-[25px] py-[14px] font-mono text-white">Contact Me</div>
            </a>
          </Reveal>
        )}

        {/* Social icons */}
        {contactSocials.length > 0 && (
          <Reveal delay={0.25} className="mt-6 flex flex-wrap items-center justify-center gap-[50px]">
            {contactSocials.map((social, index) => (
              <div key={social.id} className="flex items-center gap-[50px]">
                <a
                  href={safeUrl(social.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-[25px] leading-none text-gray-500 transition-all duration-600 hover:text-accent-light dark:hover:text-accent-dark"
                >
                  <i className={social.iconClass} aria-hidden="true" />
                </a>
                {index < contactSocials.length - 1 && (
                  <span className="font-mono text-gray-400" aria-hidden="true">
                    |
                  </span>
                )}
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
