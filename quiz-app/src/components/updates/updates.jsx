import { useEffect, useState } from "react";
import "./updates.css";

function formatRelativeTime(dateString) {
  if (!dateString || /ago$/.test(dateString)) return dateString;
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (isNaN(diff)) return dateString;
  if (diff < 60) return `${diff} second${diff !== 1 ? "s" : ""} ago`;
  const min = Math.floor(diff / 60);
  if (min < 60) return `${min} minute${min !== 1 ? "s" : ""} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr !== 1 ? "s" : ""} ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} day${day !== 1 ? "s" : ""} ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo} month${mo !== 1 ? "s" : ""} ago`;
  const yr = Math.floor(mo / 12);
  return `${yr} year${yr !== 1 ? "s" : ""} ago`;
}

export default function Updates() {
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams({
      owner: "Natti94",
      repo: "Quiz",
      per_page: "5",
      page: "1",
      all_repos: "false",
    });
    setLoading(true);
    setError("");
    const funcBase =
      import.meta.env.VITE_FUNCTIONS_BASE || "/.netlify/functions";
    const apiUrl = `/api/commits?${params.toString()}`;
    const functionUrl = `${funcBase}/getCommits?${params.toString()}`;

    const fetchFromApi = () =>
      fetch(apiUrl).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });

    const fetchFromFunction = () =>
      fetch(functionUrl).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      });

    const fetchFromGithub = () => {
      const ghUrl = `https://api.github.com/repos/Natti94/Quiz/commits?per_page=5&page=1`;
      return fetch(ghUrl).then((res) => {
        if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
        return res.json();
      });
    };

    fetchFromApi()
      .catch(() => fetchFromFunction())
      .catch(() => fetchFromGithub())
      .then((data) => {
        const normalized = Array.isArray(data)
          ? data.map((c) => ({
              hash: c.sha?.substring(0, 7) || c.hash,
              author:
                c.commit?.author?.name ||
                c.author?.login ||
                c.author ||
                "Unknown",
              date: c.commit?.author?.date || c.date,
              message: c.commit?.message || c.message,
              url: c.html_url || c.url,
              repository: c.repository || "Natti94/Quiz",
            }))
          : [];
        const sorted = normalized
          .filter((c) => c && c.date)
          .sort((a, b) => new Date(b.date) - new Date(a.date));
        const sliced = sorted.slice(0, 5);
        setUpdates(sliced);
        setCurrent(0);
      })
      .catch((e) => setError(e.message || "Failed to load commits"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="updates" aria-live="polite" aria-label="Latest updates">
      <div className="updates__title">Latest updates:</div>
      {loading && <div className="updates__empty">Loading…</div>}
      {!loading && error && (
        <div className="updates__error" role="status">
          {error}
        </div>
      )}
      {!loading && !error && updates.length === 0 && (
        <div className="updates__empty">No updates found.</div>
      )}
      {!loading && !error && updates.length > 0 && (
        <div className="updates__viewer">
          <div className="updates__row">
            {updates[current]?.url ? (
              <a
                href={updates[current].url}
                target="_blank"
                rel="noopener noreferrer"
                className="updates__message"
                aria-label={`Open commit: ${updates[current].message}`}
              >
                {updates[current].message}
              </a>
            ) : (
              <span className="updates__message">
                {updates[current].message}
              </span>
            )}
            <time className="updates__date" dateTime={updates[current].date}>
              {formatRelativeTime(updates[current].date)}
            </time>
          </div>
          <div className="updates__controls">
            <button
              type="button"
              className="updates__btn updates__btn--prev"
              onClick={() =>
                setCurrent((i) => (i - 1 + updates.length) % updates.length)
              }
              aria-label="Previous update"
            >
              Previous
            </button>
            <div className="updates__counter">
              {current + 1} / {updates.length}
            </div>
            <button
              type="button"
              className="updates__btn updates__btn--next"
              onClick={() => setCurrent((i) => (i + 1) % updates.length)}
              aria-label="Next update"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
