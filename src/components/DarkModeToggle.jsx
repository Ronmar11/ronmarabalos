/** Checkbox-driven day/night switch; the knob is drawn in index.css. */
export default function DarkModeToggle({ isDark, onChange }) {
  return (
    <label className="switch relative inline-block h-[2em] w-[3.5em] text-[12px]">
      <input
        type="checkbox"
        className="h-0 w-0 opacity-0"
        checked={isDark}
        onChange={(e) => onChange(e.target.checked)}
        aria-label="Toggle dark mode"
      />
      <span
        className={`switch-slider absolute inset-0 cursor-pointer rounded-[30px] transition-all duration-500 ${
          isDark ? 'bg-[#522ba7]' : 'bg-[#757e7e]'
        }`}
      />
    </label>
  );
}
