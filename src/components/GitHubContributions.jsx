import { useEffect, useRef, useState } from 'react';
import TerminalWindow from './TerminalWindow.jsx';

// Public, token-free service that serves GitHub's contribution calendar as JSON
// (github.com/grubersjoe/github-contributions-api). GitHub's own API would need
// a secret token, which can't live in the browser.
const API = 'https://github-contributions-api.jogruber.de/v4';
const CACHE_MS = 60 * 60 * 1000; // the graph changes slowly; refetch at most hourly

// Level 0 (none) .. 4 (most), in the site's teal.
const LEVEL_CLASS = [
  'bg-black/[0.06] dark:bg-white/[0.07]',
  'bg-prime/30',
  'bg-prime/55',
  'bg-prime/80',
  'bg-prime',
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const parseDay = (iso) => new Date(`${iso}T00:00:00Z`);
const formatDay = (iso) =>
  parseDay(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

function readCache(key) {
  try {
    const cached = JSON.parse(localStorage.getItem(key));
    return cached && Date.now() - cached.savedAt < CACHE_MS ? cached.data : null;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }));
  } catch {
    // Storage blocked -- caching is only an optimisation.
  }
}

/** Groups days into Sunday-first week columns, padding the first and last week. */
function toWeeks(days) {
  const cells = [...Array(parseDay(days[0].date).getUTCDay()).fill(null), ...days];
  while (cells.length % 7) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/** A month label over the first column in which that month appears. */
function monthLabels(weeks) {
  let previous = -1;
  return weeks.map((week) => {
    const first = week.find(Boolean);
    const month = first ? parseDay(first.date).getUTCMonth() : previous;
    const label = month !== previous ? MONTHS[month] : '';
    previous = month;
    return label;
  });
}

export default function GitHubContributions({ username }) {
  const cacheKey = `github-contributions:${username.toLowerCase()}`;
  const [state, setState] = useState(() => {
    const cached = readCache(cacheKey);
    return cached ? { status: 'ready', data: cached } : { status: 'loading', data: null };
  });
  const scrollRef = useRef(null);

  useEffect(() => {
    if (state.status === 'ready') return undefined;
    const controller = new AbortController();
    fetch(`${API}/${encodeURIComponent(username)}?y=last`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!Array.isArray(json.contributions) || !json.contributions.length) throw new Error('No data');
        const data = { total: json.total?.lastYear ?? 0, days: json.contributions };
        writeCache(cacheKey, data);
        setState({ status: 'ready', data });
      })
      .catch((error) => {
        if (error.name === 'AbortError') return;
        console.warn(`GitHub contributions for "${username}" unavailable; hiding the graph.`, error);
        setState({ status: 'error', data: null });
      });
    return () => controller.abort();
  }, [username]); // eslint-disable-line react-hooks/exhaustive-deps

  // On narrow screens the grid scrolls sideways; start at the most recent weeks.
  useEffect(() => {
    if (state.status === 'ready' && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [state.status]);

  if (state.status === 'error') return null;

  const profileUrl = `https://github.com/${encodeURIComponent(username)}`;
  const weeks = state.data ? toWeeks(state.data.days) : [];
  const labels = monthLabels(weeks);
  const summary = state.data
    ? `${state.data.total} contribution${state.data.total === 1 ? '' : 's'} in the last year`
    : 'Loading contributions';

  return (
    <TerminalWindow title={`github.com/${username}`} bodyClassName="p-4 mob:p-5">
      <div className="mb-4 font-mono text-xs">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate">
            <span className="text-prime">~/ronmar $</span> git log --since=&quot;1 year&quot;
          </p>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-black/50 transition-colors hover:text-prime dark:text-white/50"
          >
            @{username} ↗
          </a>
        </div>
        <p className="mt-1 text-sm font-semibold text-ink dark:text-[#f5f5f5]">{summary}</p>
      </div>

      {state.status === 'loading' ? (
        // Same height as the finished graph, so nothing jumps when it arrives.
        <div className="h-[118px] animate-pulse rounded-md bg-black/[0.04] dark:bg-white/[0.05]" aria-hidden="true" />
      ) : (
        <div className="mx-auto w-fit max-w-full">
          <div ref={scrollRef} className="overflow-x-auto pb-1" role="img" aria-label={`${summary} on GitHub`}>
            <div className="inline-flex flex-col gap-1" aria-hidden="true">
              <div className="flex gap-[3px] font-mono text-[10px] text-black/45 dark:text-white/45">
                {labels.map((label, i) => (
                  // Labels may overflow their 11px column; nowrap keeps them on one line.
                  <span key={i} className="w-[11px] shrink-0 whitespace-nowrap">
                    {label}
                  </span>
                ))}
              </div>
              <div className="flex gap-[3px]">
                {weeks.map((week, i) => (
                  <div key={i} className="flex flex-col gap-[3px]">
                    {week.map((day, j) =>
                      day ? (
                        <span
                          key={day.date}
                          title={`${day.count || 'No'} contribution${day.count === 1 ? '' : 's'} on ${formatDay(day.date)}`}
                          className={`h-[11px] w-[11px] rounded-[2px] ${LEVEL_CLASS[day.level] ?? LEVEL_CLASS[0]}`}
                        />
                      ) : (
                        <span key={`pad-${j}`} className="h-[11px] w-[11px]" />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-end gap-1.5 font-mono text-[10px] text-black/45 dark:text-white/45" aria-hidden="true">
            Less
            {LEVEL_CLASS.map((cls, i) => (
              <span key={i} className={`h-[11px] w-[11px] rounded-[2px] ${cls}`} />
            ))}
            More
          </div>
        </div>
      )}
    </TerminalWindow>
  );
}
