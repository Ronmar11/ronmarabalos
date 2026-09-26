import { m } from 'framer-motion';

// One easing curve for the whole site: a fast start that settles softly.
export const EASE = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** Fades and lifts its children in the first time they scroll into view. */
export function Reveal({ as = 'div', delay = 0, y = 24, className, children }) {
  const Component = m[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </Component>
  );
}

/**
 * Container that reveals its <StaggerItem> children one after another.
 * `amount` is how much of the container must be visible before it starts;
 * keep it low for tall grids so they don't wait until half-way down.
 */
export function Stagger({ as = 'div', stagger = 0.08, amount = 0.1, className, children }) {
  const Component = m[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Component>
  );
}

/**
 * A single staggered child. Wrap elements that have their own CSS transforms
 * (hover lifts, scales) rather than animating them directly -- Framer writes
 * an inline transform that would override those Tailwind classes.
 */
export function StaggerItem({ as = 'div', className, children }) {
  const Component = m[as];
  return (
    <Component className={className} variants={fadeUp}>
      {children}
    </Component>
  );
}
