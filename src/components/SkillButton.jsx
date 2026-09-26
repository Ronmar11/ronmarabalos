import { useTapActive } from '../hooks/useTapActive.js';
import { safeUrl } from '../lib/safeUrl.js';

export default function SkillButton({ skill }) {
  const [isActive, toggle] = useTapActive();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isActive}
      className={`tech-button flex h-[60px] w-fit touch-manipulation cursor-pointer select-none items-center justify-between gap-2.5 rounded-[0.5em] border border-neu p-2.5 text-[12px] font-bold text-neu-text shadow-neu mob:h-[70px] mob:text-[17px] dark:text-[#f5f5f5] dark:shadow-neu-dark ${
        isActive ? 'is-active' : ''
      }`}
    >
      {skill.iconClass ? (
        <i className={`${skill.iconClass} text-[30px] mob:text-[35px]`} aria-hidden="true" />
      ) : (
        safeUrl(skill.iconSrc) && <img src={safeUrl(skill.iconSrc)} width="40" alt="" aria-hidden="true" />
      )}
      <span className="font-mono">{skill.name}</span>
      <span className="font-mono">{skill.exp}</span>
    </button>
  );
}
