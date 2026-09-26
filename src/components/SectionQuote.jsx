import { Reveal } from './motion/Reveal.jsx';

/** A centred section tagline. */
export default function SectionQuote({ children, className = '' }) {
  return (
    <Reveal delay={0.1} className={`mb-[min(50px,8%)] flex justify-center ${className}`}>
      <p className="w-[50rem] max-w-full text-center text-[clamp(1.2rem,2.1vw,2.4rem)] font-semibold">
        {children}
      </p>
    </Reveal>
  );
}
